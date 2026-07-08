import React from 'react';
import Nav from '../components/layout/Nav';
import Hero from '../components/home/Hero';
import Problem from '../components/home/Problem';
import Solution from '../components/home/Solution';
import ScoringEngine from '../components/home/ScoringEngine';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-paper text-slate flex flex-col">
      <Nav />
      <main className="flex-grow">
        <Hero />
        <Problem />
        <Solution />
        <ScoringEngine />
      </main>
    </div>
  );
};

export default Landing;
