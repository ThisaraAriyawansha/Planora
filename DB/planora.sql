-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 11, 2025 at 08:49 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `planora`
--

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `location` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `capacity` int(11) NOT NULL,
  `main_image` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `organizer_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `date`, `time`, `location`, `description`, `capacity`, `main_image`, `category`, `organizer_id`, `created_at`, `status`) VALUES
(2, 'EduFair Sri Lanka 2025', '2025-06-18', '11:00:00', 'Kandy City Centre', 'Sri Lanka’s leading educational fair welcomes students and parents to meet with representatives from universities, vocational institutes, and scholarship programs worldwide. Includes seminars on career planning, visa processes, and study-abroad opportunities.', 1000, '/uploads/1749621698117-991087562.jpg', 'Education', 1, '2025-06-08 08:01:55', 'active'),
(3, 'Startup Expo Sri Lanka', '2025-06-19', '14:00:00', 'Nelum Pokuna Theatre, Colombo', 'A must-attend event for entrepreneurs, investors, and tech innovators. Learn from expert panels, connect with venture capitalists, and explore an exhibition hall filled with emerging Sri Lankan startups in fintech, healthtech, and edtech.\r\nCategory: Business', 400, '/uploads/1749622097452-68183799.jpg', 'Business', 4, '2025-06-08 12:01:33', 'active'),
(4, 'Colombo Tech Summit 2025', '2025-06-27', '12:00:00', ' BMICH, Colombo', 'Join industry leaders, developers, and tech enthusiasts at Sri Lanka’s largest annual technology summit. This year’s event features keynote speeches from international innovators, workshops on AI, blockchain, and IoT, and a startup pitch competition with global investors.', 1000, '/uploads/1749622487113-77604852.jpg', 'Tech', 1, '2025-06-11 06:14:47', 'active'),
(5, 'Galle Music Festival', '2025-06-20', '18:00:00', 'Galle Fort, Galle', 'An exciting weekend filled with live performances by traditional Sri Lankan folk musicians, modern pop bands, and international guest artists. With food stalls, art installations, and dance stages, this festival brings the city alive in a celebration of sound and culture.', 2000, '/uploads/1749622753990-213718029.jpg', 'Music', 1, '2025-06-11 06:19:13', 'active'),
(6, 'Colombo Marathon 2025', '2025-06-12', '11:00:00', 'Colombo City', 'Join thousands of local and international runners in the scenic Colombo Marathon that winds through the heart of the city. The event includes full marathon, half marathon, 10K, and family fun run categories. Supporters enjoy live music, hydration stations, and fitness booths.\r\nCategory: Sports', 500, '/uploads/1749622958215-251905216.jpg', 'Sports', 1, '2025-06-11 06:22:38', 'active'),
(7, 'Jaffna Art Week', '2025-07-03', '09:00:00', 'Jaffna Public Library', 'A week-long celebration of Northern art and heritage featuring exhibitions by emerging Sri Lankan artists, street murals, photography contests, and interactive workshops on traditional crafts and modern design. Cultural performances are held each evening.', 600, '/uploads/1749623182087-970044422.jpg', 'Art', 1, '2025-06-11 06:26:22', 'active'),
(8, 'Colombo Street Food Carnival', '2025-07-04', '16:00:00', 'Green Path, Colombo', 'A paradise for food lovers! This carnival showcases authentic Sri Lankan dishes, international fusion food, and unique desserts. Enjoy live cooking shows, recipe contests, and musical performances while exploring over 100 food stalls.', 800, '/uploads/1749623399131-285192647.webp', 'Food', 1, '2025-06-11 06:29:59', 'active'),
(9, 'Health & Wellness Expo', '2025-06-27', '08:00:00', 'ugathadasa Indoor Stadium, Colombo', 'Discover the path to better living with over 200 exhibitors in fitness, nutrition, mental health, Ayurveda, and modern medicine. Participate in free yoga sessions, BMI checks, health talks by doctors, and workshops on stress management and healthy eating.', 800, '/uploads/1749623790054-473312549.jpg', 'Health', 1, '2025-06-11 06:36:30', 'active'),
(10, 'Future Minds National Career Fair', '2025-06-29', '21:00:00', 'Bandaranaike Memorial International Conference Hall (BMICH), Colombo', 'Future Minds is a nationally recognized education and career exhibition that guides students toward higher education opportunities both locally and internationally. The event hosts universities, vocational training institutes, professional organizations, and scholarship providers. Attendees can engage in one-on-one career guidance sessions, attend motivational talks by top educators and professionals, and access free resources on CV writing and job interviews. Special sessions focus on emerging career fields like data science, robotics, and digital marketing.', 2000, '/uploads/1749624025585-784739378.jpeg', 'Education', 1, '2025-06-11 06:40:25', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `event_images`
--

CREATE TABLE `event_images` (
  `id` int(11) NOT NULL,
  `event_id` int(11) DEFAULT NULL,
  `image_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_images`
--

INSERT INTO `event_images` (`id`, `event_id`, `image_url`) VALUES
(13, 2, '/uploads/1749621718119-157497076.jpg'),
(14, 2, '/uploads/1749621736758-420996754.jpg'),
(15, 2, '/uploads/1749621805754-261779428.webp'),
(16, 2, '/uploads/1749621805754-484241048.jpeg'),
(18, 3, '/uploads/1749622188954-357887574.webp'),
(19, 3, '/uploads/1749622188955-327799419.jpg'),
(20, 3, '/uploads/1749622188956-928785669.jpg'),
(21, 4, '/uploads/1749622487115-13887404.png'),
(22, 4, '/uploads/1749622487117-676910965.webp'),
(23, 4, '/uploads/1749622487118-96602048.png'),
(24, 4, '/uploads/1749622487123-919765636.jpeg'),
(25, 5, '/uploads/1749622862228-197890751.webp'),
(26, 5, '/uploads/1749622862228-432057311.webp'),
(27, 6, '/uploads/1749623053096-229014645.webp'),
(28, 6, '/uploads/1749623053096-850183801.jpg'),
(29, 6, '/uploads/1749623053109-277269560.jpg'),
(30, 6, '/uploads/1749623053109-856349142.webp'),
(31, 7, '/uploads/1749623283615-569056475.jpg'),
(32, 7, '/uploads/1749623283616-312594679.jpg'),
(33, 7, '/uploads/1749623283628-283579533.jpg'),
(34, 8, '/uploads/1749623504135-995800018.jpg'),
(35, 8, '/uploads/1749623504135-127310943.webp'),
(36, 8, '/uploads/1749623504147-213389863.webp'),
(37, 9, '/uploads/1749623828984-32628927.jpeg'),
(38, 9, '/uploads/1749623828984-240327156.jpg'),
(39, 9, '/uploads/1749623828986-952878210.webp'),
(40, 10, '/uploads/1749624122281-671027489.jpg'),
(41, 10, '/uploads/1749624122282-975347233.jpg'),
(42, 10, '/uploads/1749624122283-911887018.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `registrations`
--

CREATE TABLE `registrations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `event_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `registrations`
--

INSERT INTO `registrations` (`id`, `user_id`, `event_id`, `created_at`) VALUES
(3, 1, 2, '2025-06-08 08:11:49'),
(4, 2, 2, '2025-06-08 11:55:43'),
(5, 2, 3, '2025-06-08 12:03:56'),
(6, 17, 3, '2025-06-09 15:36:58'),
(11, 17, 2, '2025-06-10 06:00:32');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` enum('Admin','Organizer','Participant') DEFAULT 'Participant',
  `preference` varchar(50) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `name`, `role`, `preference`, `status`, `created_at`) VALUES
(1, 'abc@gmail.com', '$2b$10$/lUKe5gbBQA6dLuCVo608OSevfYWww/k626lUMOBhtOh1jF3ukLmW', 'EduFair ', 'Organizer', NULL, 'active', '2025-06-08 03:43:28'),
(2, 'bbb@gmail.com', '$2b$10$uEl/vpe8abBzr2/PIi3uuuwqRhV3wI20Vhq29bSI3ZFt7dU22QGKC', 'aaa', 'Participant', NULL, 'active', '2025-06-08 03:50:15'),
(3, 'admin@gmail.com', '$2b$10$uCz8V5Kt0AOBVjV72sbh9OgNxKWWhF.tMgCVjCU/TkeMzXPpqgw32', 'admin', 'Admin', NULL, 'active', '2025-06-08 03:50:57'),
(4, 'ab@gmail.com', '$2a$10$qkjUmlWHFRBBf4HsGpefzevHgxKZ8f3ToIo.swvkP7gkNTrtyp9tu', 'Startup Expo', 'Organizer', NULL, 'active', '2025-06-08 11:58:34'),
(5, 'abcde@gmail.com', '$2a$10$gq7AqWG9xuP2k3A.OpG1F.KcuakGS5SGExnmFYDNcmb1mq38/za.S', 'abcde', 'Participant', NULL, 'active', '2025-06-09 14:38:17'),
(6, 'bv@gmail.com', '$2a$10$d5KYw2LJSVtUPIQ7tMl2VOqAUWxMy//HnQhfuqxz5O6yZAynLenCC', 'bbbb', 'Participant', NULL, 'active', '2025-06-09 14:48:36'),
(7, 'aaaa@gmail.com', '$2a$10$baZhgV3bVBAel9ANxW0yj.tjLhJaN2qfpjg.sqS6SuaR6AYqUYPA2', 'aaaa', 'Participant', 'Tech', 'active', '2025-06-09 14:53:59'),
(8, 'vjh@gmail.com', '$2a$10$R.uobtG9.OZtHGFpaoNQiuBTLlw5X1CpxyLXkpM2k3xBf1yeaW87m', 'bbbbb', 'Organizer', NULL, 'active', '2025-06-09 15:05:50'),
(16, 'fff@gmail.com', '$2a$10$p2y8Wy/9qIjf001dwLMLK.R3Z3CGvBukZ.o4P6jc4JKgtudIF4J5S', 'aaa', 'Participant', 'Tech', 'active', '2025-06-09 15:27:38'),
(17, 'thisara.a2001@gmail.com', '$2a$10$Q.wX2H2bd8VF2mpVEYtyBeBFQTn.PojMMIO6R5Usss9yPtV23pIMq', 'Thisara', 'Participant', 'Education', 'active', '2025-06-09 15:34:16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `organizer_id` (`organizer_id`);

--
-- Indexes for table `event_images`
--
ALTER TABLE `event_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `registrations`
--
ALTER TABLE `registrations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `event_images`
--
ALTER TABLE `event_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `registrations`
--
ALTER TABLE `registrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `event_images`
--
ALTER TABLE `event_images`
  ADD CONSTRAINT `event_images_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`);

--
-- Constraints for table `registrations`
--
ALTER TABLE `registrations`
  ADD CONSTRAINT `registrations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `registrations_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
