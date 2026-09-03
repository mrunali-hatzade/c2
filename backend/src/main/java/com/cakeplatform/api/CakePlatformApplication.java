package com.cakeplatform.api;

import com.cakeplatform.api.config.FileStorageProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableAsync
@EnableCaching
@EnableConfigurationProperties({FileStorageProperties.class})
public class CakePlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(CakePlatformApplication.class, args);
    }
}
