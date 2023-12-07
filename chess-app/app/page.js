'use client'
import "./App.css";
import chessboard from './src/chessBoardComponent.tsx'
import { useEffect, useState } from "react";

export default function App() {


  return (
      <div>
        {chessboard()}
      </div>
  );
}
