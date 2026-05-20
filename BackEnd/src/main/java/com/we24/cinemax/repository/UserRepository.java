//package com.we24.cinemax.repository;
//
//
//import com.we24.cinemax.model.User;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//public interface UserRepository extends JpaRepository<User, Long> {
//}

package com.we24.cinemax.repository;

import com.we24.cinemax.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByGmail(String gmail);

    Optional<User> findByPhoneNumber(String phoneNumber);

    boolean existsByGmail(String gmail);

    boolean existsByPhoneNumber(String phoneNumber);
}