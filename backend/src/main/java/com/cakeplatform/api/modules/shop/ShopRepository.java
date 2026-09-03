package com.cakeplatform.api.modules.shop;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Long>, JpaSpecificationExecutor<Shop> {
    List<Shop> findByOwnerId(Long ownerId);
    long countByStatus(ShopStatus status);
    List<Shop> findByStatus(ShopStatus status);
    
    @Query("SELECT s FROM Shop s WHERE s.status = :status AND (" +
           "LOWER(s.city) LIKE LOWER(CONCAT('%', :location, '%')) OR " +
           "s.pincode = :location OR " +
           "LOWER(s.area) LIKE LOWER(CONCAT('%', :location, '%')) OR " +
           "LOWER(s.address) LIKE LOWER(CONCAT('%', :location, '%')))")
    List<Shop> searchByLocationAndStatus(@Param("location") String location, @Param("status") ShopStatus status);
}
