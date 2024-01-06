'use client'
import "./App.css";
import chessboard from './App.tsx'
import { useEffect, useState } from "react";

export default function App() {


  return (
      <div>
        {chessboard()}
      </div>
  );
}
