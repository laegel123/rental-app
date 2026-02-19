package com.grabnextdoor.geocode.service;

import com.grabnextdoor.geocode.service.GeocodioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.locationtech.jts.geom.Point;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

// Added a comment to force recompilation
@ExtendWith(MockitoExtension.class)
class GeocodioServiceTest {

    @Mock
    private WebClient.Builder webClientBuilder;

    @Mock
    private WebClient webClient;

    @Mock
    private WebClient.RequestHeadersUriSpec requestHeadersUriSpec;

    @Mock
    private WebClient.RequestHeadersSpec requestHeadersSpec;

    @Mock
    private WebClient.ResponseSpec responseSpec;

    private GeocodioService geocodioService;

    @BeforeEach
    void setUp() {
        // Mock the WebClient.Builder chained calls
        when(webClientBuilder.baseUrl(anyString())).thenReturn(webClientBuilder);
        when(webClientBuilder.build()).thenReturn(webClient);

        // Manually instantiate the service with the mocked builder
        geocodioService = new GeocodioService(webClientBuilder);

        // Inject mock API key using ReflectionTestUtils since @Value is not processed in unit tests
        ReflectionTestUtils.setField(geocodioService, "geocodioApiKey", "test-api-key");
    }

    @Test
    void getCoordinatesForPostalCode_shouldReturnPointForValidPostalCode() {
        // Given
        String postalCode = "M5G 1P8";
        double expectedLat = 43.6568;
        double expectedLng = -79.3877;

        // Mock Geocodio API response
        GeocodioService.Location mockLocation = new GeocodioService.Location();
        mockLocation.lat = expectedLat;
        mockLocation.lng = expectedLng;

        GeocodioService.Result mockResult = new GeocodioService.Result();
        mockResult.location = mockLocation;

        GeocodioService.GeocodioResponse mockResponse = new GeocodioService.GeocodioResponse();
        mockResponse.results = Collections.singletonList(mockResult);

        // Configure mock WebClient behavior
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(any(java.util.function.Function.class))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(GeocodioService.GeocodioResponse.class)).thenReturn(Mono.just(mockResponse));

        // When
        Mono<Point> resultMono = geocodioService.getCoordinatesForPostalCode(postalCode);

        // Then
        Point resultPoint = resultMono.block(); // Block to get the result from Mono
        assertNotNull(resultPoint);
        assertEquals(expectedLng, resultPoint.getX(), 0.001); // X is longitude
        assertEquals(expectedLat, resultPoint.getY(), 0.001); // Y is latitude
        assertEquals(4326, resultPoint.getSRID()); // Check SRID
    }

    @Test
    void getCoordinatesForPostalCode_shouldReturnEmptyMonoForInvalidPostalCode() {
        // Given
        String postalCode = "INVALID";

        GeocodioService.GeocodioResponse mockResponse = new GeocodioService.GeocodioResponse();
        mockResponse.results = Collections.emptyList(); // Empty results for invalid postal code

        // Configure mock WebClient behavior for an empty response
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(any(java.util.function.Function.class))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(GeocodioService.GeocodioResponse.class)).thenReturn(Mono.just(mockResponse));

        // When
        Mono<Point> resultMono = geocodioService.getCoordinatesForPostalCode(postalCode);

        // Then
        StepVerifier.create(resultMono)
                .verifyComplete();
    }

    @Test
    void getCoordinatesForPostalCode_shouldHandleApiErrorGracefully() {
        // Given
        String postalCode = "M5G 1P8";

        // Configure mock WebClient to return an error
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(any(java.util.function.Function.class))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(GeocodioService.GeocodioResponse.class)).thenReturn(Mono.error(new RuntimeException("API Error")));

        // When
        Mono<Point> resultMono = geocodioService.getCoordinatesForPostalCode(postalCode);

        // Then
        // Expect the Mono to propagate the error, not a successful Point
        assertThrows(RuntimeException.class, resultMono::block);
    }
}
