package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import java.io.FileInputStream;
import java.io.IOException;

/**
 * Hello world!
 *
 */
@SpringBootApplication
public class App 
{
    public static void main( String[] args )
    {

        try {
            FirebaseInitializer.initialize();
        } catch (IOException e) {
            e.printStackTrace();  // Or handle it more gracefully
        }

        SpringApplication.run(App.class, args);
    }
}
