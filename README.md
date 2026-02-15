# Invoice Generator App

Full stack invoice management app built using:

Frontend:
- React.js
- CSS

Backend:
- Node.js
- Express.js
- MongoDB

Features:
- Create invoices 
- Invoice status (PAID / UNPAID)
- PDF download
- Responsive UI

# Project Structure

invoice-app/
│
<br/>
├── client/ # React frontend
├── server/ # Node.js backend
├── .env # Environment variables (not pushed to GitHub)
├── .gitignore
└── README.md

## ⚙️ Setup Instructions

### 1️ Clone the Repository

run command on terminal:

git clone https://github.com/your-username/invoice-app.git
cd invoice-app

### 2 Setup Backend (Server)
run command:

cd server
npm install

# Create .env file inside server/
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/invoiceDB

# Run server command: 

node app.js


3️ Setup Frontend (Client)

Open new terminal:
Run below commands

cd client
npm install
npm run dev


# Future Enhancements

 User authentication

 Invoice sharing

 Cloud database deployment

 Dashboard analytics



