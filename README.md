# ReTreasure - Sharing Second-Hand System

ReTreasure is a platform that connects people who have second-hand items with those who need them, aiming to reduce waste and optimize resources. It fosters a community spirit of creativity and sharing.

## Features

### Users:
- **Login**: Users can log in using Google or Gmail accounts.
- **Logout**
- **Register**: New users can create accounts.
- **Forgot Password**
- **Change Password**
- **Update User Information**
- **Select User Location**

### Givers:
- **Post Product Listings**: Users can post items either directly to recipients or to storage.
- **Select Recipients**: Choose recipients for items.
- **Confirm Transactions**: Confirm item transfers.
- **Report Receivers**
- **Track Donations**: Track the status of posted items.
- **Edit Post**: Modify posted items.
- **Transaction History**
- **Message Receivers**
- **Receive and View, Delete, Mark Read Notifications from Recipients**

### Receivers:
- **View Listings**: See available and stored listings.
- **View Listing Details**
- **Filter Listings**: Filter by product type, distance, time, and sort by newest, closest, etc.
- **Search Listings by Title**
- **Message Givers**
- **Request Listings**: Request items either directly or for storage.
- **Cancel Direct Request**
- **Report Givers**
- **Confirm Pick-Up**: Confirm item pick-up.
- **Track Received Orders**
- **Transaction History**
- **Receive and View, Delete, Mark Notifications from Givers**
- **Scan QR Codes**
- **Rate Givers**
- **View Detailed Information on Givers of Listings**
- **Like, Unlike Listings**
- **View Wishlist Listings**
- **View Requested Listings**

### Admin:
- **View, Delete, Mark Read Notification Lists**
- **View Statistics (Number of Post Listings, Number of Visitors, Quantity of Goods In/Out, Inventory) in various charts (Line, Column, Circle)**
- **View, Filter Warehouse Lists**
- **View, Filter Partner Lists**
- **View, Filter User Lists**
- **Add, Edit, Lock Warehouse**
- **Add, Edit, Delete Partners**
- **Delete Users**
- **Lock Partner and User Accounts**
- **Reset Partner Password**
- **Contact Partners, Users, Warehouses**
- **Partners: View, Delete, Mark Read Notification Lists**
- **View Lists of Items from Givers Near Warehouse and Warehouse Listings**
- **View Listing Details**
- **View Statistics**
- **Manage Orders**
- **Handle user complaints / reports**
- **Confirm / report on product expiration to administrator (weekend)**
- **Warehouse entry / exit**
- **Status confirmation**
- **Report**
- **Admin cannot arbitrarily create entry / exit voucher**
- **Take pictures of classified products**
- **Create QR for items**
- **History for / receive**
- **Permissions management based on location in case there are multiple warehouses that need to be managed in multiple locations**

## Software Architecture

- **Mobile for Users and Partners**: React Native (Expo)
- **Web for Admins and Partners**: React (Vite)
- **Backend**: Node.js
- **Database**: PostgreSQL
- **Deployment**:
  - **Mobile** [Google Play Store - Closed Beta Testing](https://play.google.com/store/apps/details?id=com.retreasure.frontendmobile)

![image](https://github.com/Vawnndv/Sharing-Second-hand-System/assets/90141979/cc1d0890-959d-4b67-b417-ba5b3138dba7)


  - **Web** [Vercel](https://sharing-second-hand-system.vercel.app/)
  - **Backend**: Azure
- **CI/CD**: Continuous integration and deployment for both backend and frontend

## Requirements

To run the application locally, ensure you have the following prerequisites installed:

- **Node.js**
- **PostgreSQL**
- **Expo CLI** for mobile development
- **Vite** for web development
- **Azure** for backend deployment

## Getting Started

1. Clone this repository to your local machine.
2. Install dependencies:
   ```bash
   npm install
3. Set up PostgreSQL and update the database configuration in .env file.
4. Start the backend server:
   ```bash
   npm run dev
5. Start the frontend (React web app):
   ```bash
   npm run dev
6. Start the mobile app (React Native)
   ```bash
   npm start
7. Open the application in your browser or mobile device to begin using ReTreasure.

## Contributing

Contributions from the following individuals are welcome:
- [Nguyễn Đình Văn](https://github.com/Vawnndv)
- [Châu Hoàng Tấn](https://github.com/ChauHoangTan)
- [Lê Trần Phi Hùng](https://github.com/LTPhiHung)
- [Hứa Lâm Chí Cường](https://github.com/hualamchicuong)

If you encounter any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

Unless otherwise stated in individual files or directories, you are free to use, modify, and distribute the code in this repository for your own projects under the terms of the MIT License.

