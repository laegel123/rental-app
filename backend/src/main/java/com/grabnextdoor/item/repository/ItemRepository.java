package com.grabnextdoor.item.repository;

import com.grabnextdoor.item.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    @Query(value = "SELECT * FROM items i WHERE ST_Distance_Sphere(i.location, ST_GeomFromText(:point, 4326)) <= :radius", nativeQuery = true)
    List<Item> findItemsWithinRadius(@Param("point") String pointWkt, @Param("radius") double radiusInMeters);
}
