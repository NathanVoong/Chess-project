'use client'
import "./src/App.css";
import chessboard from './src/App.tsx'
import { useEffect, useState } from "react";

export default function App() {


  return (
      <div>
        {chessboard()}
      </div>
  );
}
