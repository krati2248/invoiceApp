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
<br/>
│
<br/>
├── client/ # React frontend
<br/>
├── server/ # Node.js backend
<br/>
├── .env # Environment variables 
<br/>
├── .gitignore
<br/>
└── README.md

## ⚙️ Setup Instructions

### 1️ Clone the Repository

run command on terminal:
<br/>
git clone https://github.com/krati2248/invoiceApp.git
<br/>
cd invoiceApp

### 2 Setup Backend (Server)
run command:
<br/>
cd server
<br/>
npm install

#### Create .env file inside server/
PORT=3000
<br/>
MONGO_URL=mongodb://127.0.0.1:27017/invoiceDB

### Run server command: 
node app.js


### 3️ Setup Frontend (Client)

Open new terminal:
<br/>
Run below commands
<br/>
cd client
<br/>
npm install
<br/>
npm run dev
<br/>

Click on: 
http://localhost:5173/

# Future Enhancements

 User authentication

 Invoice sharing

 Cloud database deployment

 Dashboard analytics



