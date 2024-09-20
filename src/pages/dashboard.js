// pages/dashboard.js
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export async function getServerSideProps(context) {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        return resolve({
          redirect: {
            destination: "/login",
            permanent: false,
          },
        });
      }

      resolve({
        props: {}, // Add any props you want to pass to the page
      });
    });
  });
}

const Dashboard = () => {
  return <div>Welcome to the Dashboard</div>;
};

export default Dashboard;
