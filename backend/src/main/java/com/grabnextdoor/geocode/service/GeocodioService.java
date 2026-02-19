package com.grabnextdoor.geocode.service;

import com.grabnextdoor.user.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.io.WKTReader;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class GeocodioService {

    @Value("${geocodio.api.key}")
    private String geocodioApiKey;

    private final WebClient webClient;
    private final GeometryFactory geometryFactory = new GeometryFactory(new org.locationtech.jts.geom.PrecisionModel(), 4326);

    public GeocodioService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.geocod.io/v1.9").build();
    }

    /**
     * Converts a Canadian postal code to a Point object (latitude and longitude).
     *
     * @param postalCode The Canadian postal code (e.g., "M5G 1P8").
     * @return A Mono emitting a Point object if successful, or an empty Mono if not found or an error occurs.
     */
    public Mono<Point> getCoordinatesForPostalCode(String postalCode) {
        String formattedPostalCode = postalCode.replace(" ", "+");
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/geocode")
                        .queryParam("q", formattedPostalCode)
                        .queryParam("country", "Canada")
                        .queryParam("api_key", geocodioApiKey)
                        .build())
                .retrieve()
                .bodyToMono(GeocodioResponse.class)
                .flatMap(response -> {
                    if (response != null && response.results != null && !response.results.isEmpty()) {
                        Location loc = response.results.get(0).location;
                        // Geocodio returns [latitude, longitude], JTS Point constructor is (x,y) -> (longitude, latitude)
                        // SRID 4326 is for WGS84, which uses (longitude, latitude)
                        Point point = geometryFactory.createPoint(new org.locationtech.jts.geom.Coordinate(loc.lng, loc.lat));
                        return Mono.just(point);
                    }
                    return Mono.empty();
                });
    }

    // --- DTOs for Geocodio API Response ---

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GeocodioResponse {
        public List<Result> results;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Result {
        public Location location;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Location {
        public double lat;
        public double lng;
    }
}
