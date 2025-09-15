package com.tourism.core.config;

import com.tourism.common.enums.UserRole;
import com.tourism.core.entity.User;
import com.tourism.core.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Initialize default data when the application starts
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.tourism.core.repository.TourRepository tourRepository;

    @Autowired
    private com.tourism.core.repository.PackageRepository packageRepository;

    @Autowired
    private com.tourism.core.repository.BookingRepository bookingRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        createDefaultUsers();
        createSampleToursAndPackages();
    }

    private void createSampleToursAndPackages() {
        // Create sample tours if none exist
        if (tourRepository.count() == 0) {
            java.time.LocalDate today = java.time.LocalDate.now();

            com.tourism.core.entity.Tour islandTour = new com.tourism.core.entity.Tour(
                    "Island Explorer",
                    "A relaxing 3-day island tour with snorkeling and beach BBQ.",
                    "Paradise Island",
                    3,
                    30,
                    today.plusDays(14),
                    today.plusDays(17)
            );

            com.tourism.core.entity.Tour mountainTour = new com.tourism.core.entity.Tour(
                    "Mountain Adventure",
                    "A 5-day trekking experience to the scenic highlands.",
                    "Highland Peaks",
                    5,
                    20,
                    today.plusDays(30),
                    today.plusDays(35)
            );

            tourRepository.save(islandTour);
            tourRepository.save(mountainTour);
            System.out.println("✅ Created sample tours: Island Explorer, Mountain Adventure");
        }

        // Create sample packages for the tours
        if (packageRepository.count() == 0) {
            com.tourism.core.entity.Tour t1 = tourRepository.findByNameContainingIgnoreCase("Island Explorer").stream().findFirst().orElse(null);
            com.tourism.core.entity.Tour t2 = tourRepository.findByNameContainingIgnoreCase("Mountain Adventure").stream().findFirst().orElse(null);

            if (t1 != null) {
                com.tourism.core.entity.Package p1 = new com.tourism.core.entity.Package(
                        "Island Explorer - Standard",
                        t1.getId(),
                        new java.math.BigDecimal("299.99"),
                        "[\"Accommodation\", \"Breakfast\", \"Snorkeling gear\"]",
                        "[]",
                        "Hotel",
                        "Boat",
                        "Breakfast"
                );
                packageRepository.save(p1);
            }

            if (t2 != null) {
                com.tourism.core.entity.Package p2 = new com.tourism.core.entity.Package(
                        "Mountain Adventure - Trek",
                        t2.getId(),
                        new java.math.BigDecimal("499.99"),
                        "[\"Guide\", \"Camping gear\", \"Meals\"]",
                        "[]",
                        "Camp",
                        "Hike",
                        "All meals"
                );
                packageRepository.save(p2);
            }

            System.out.println("✅ Created sample packages for sample tours");
        }

        // Create a couple of sample bookings (only if none exist)
        if (bookingRepository.count() == 0 && userRepository.findByUsername("tourist").isPresent()) {
            com.tourism.core.entity.User tourist = userRepository.findByUsername("tourist").get();
            com.tourism.core.entity.Package pkg = packageRepository.findAll().stream().findFirst().orElse(null);

            if (pkg != null) {
                com.tourism.core.entity.Booking b1 = new com.tourism.core.entity.Booking();
                b1.setBookingReference("SAMPLE-BK-1");
                b1.setPackageId(pkg.getId());
                b1.setTouristId(tourist.getId());
                b1.setNumberOfPeople(2);
                b1.setTotalAmount(pkg.getPrice().multiply(new java.math.BigDecimal(2)));
                bookingRepository.save(b1);

                System.out.println("✅ Created sample booking SAMPLE-BK-1 for tourist");
            }
        }
    }

    private void createDefaultUsers() {
        // Check if admin user already exists
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@tourism.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("System Administrator");
            admin.setPhone("+1234567890");
            admin.setRole(UserRole.ADMIN);
            admin.setEnabled(true);
            userRepository.save(admin);
            System.out.println("✅ Created default admin user: admin/admin123");
        }

        // Check if tourist user already exists
        if (userRepository.findByUsername("tourist").isEmpty()) {
            User tourist = new User();
            tourist.setUsername("tourist");
            tourist.setEmail("tourist@example.com");
            tourist.setPassword(passwordEncoder.encode("password"));
            tourist.setFullName("Tourist User");
            tourist.setPhone("+1234567891");
            tourist.setRole(UserRole.TOURIST);
            tourist.setEnabled(true);
            userRepository.save(tourist);
            System.out.println("✅ Created default tourist user: tourist/password");
        }

        // Check if tour operator user already exists
        if (userRepository.findByUsername("operator").isEmpty()) {
            User operator = new User();
            operator.setUsername("operator");
            operator.setEmail("operator@tourism.com");
            operator.setPassword(passwordEncoder.encode("operator123"));
            operator.setFullName("Tour Operator");
            operator.setPhone("+1234567892");
            operator.setRole(UserRole.TOUR_OPERATOR);
            operator.setEnabled(true);
            userRepository.save(operator);
            System.out.println("✅ Created default tour operator user: operator/operator123");
        }

        System.out.println("📊 Total users in database: " + userRepository.count());
    }
}
