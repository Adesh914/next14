"use client"
import React from 'react';
import styles from "./page.module.css";
import Login from "./compoment/Login";
import Register from "./compoment/Register";
import { Toaster } from "react-hot-toast";
// import JqueryDatatable from "./compoment/JqueryDatatable";


export default function Home() {


  return (
    <main className={styles.main}>
      <Toaster position="top-right" toastOptions={{
        // Define default options
        className: '',
        duration: 2000,

      }} />
      <div className={styles.description}>
        <Login />
        <Register />
        {/*  <JqueryDatatable /> */}
      </div>
      {/*  <div className={styles.description}> <JqueryDatatable /></div> */}
      {/* <div className={styles.description}>
        <p>
          Get started by editing&nbsp;
          <code className={styles.code}>app/page.js</code>
        </p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div> */}

      {/* <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div> */}


    </main>
  );
}
