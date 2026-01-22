
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { INGREDIENTS, HEAT_SETTINGS } from './constants';
import { Ingredient, HeatLevel, CookingResult, AppState } from './types';
import { judgeDish } from './geminiService';

export default function App() {
  const [state, setState] = useState<AppState>({
    selectedIngredients: [],
    isCooking: false,
    heatLevel: 'medium',
    timer: 0,
    result: null,
    loading: false,
  });

  // Fixed: Replaced NodeJS.Timeout with number | null to resolve 'Cannot find namespace NodeJS' in browser environment
  const timerRef = useRef<number | null>(null);

  const toggleIngredient = (ingredient: Ingredient) => {
    if (state.isCooking || state.loading) return;
    
    setState(prev => {
      const isSelected = prev.selectedIngredients.find(i => i.id === ingredient.id);
      if (isSelected) {
        return {
          ...prev,
          selectedIngredients: prev.selectedIngredients.filter(i => i.id !== ingredient.id)
        };
      }
      if (prev.selectedIngredients.length >= 5) return prev;
      return {
        ...prev,
        selectedIngredients: [...prev.selectedIngredients, ingredient]
      };
    });
  };

  const startCooking = () => {
    if (state.selectedIngredients.length === 0) return;
    setState(prev => ({ ...prev, isCooking: true, timer: 0 }));
  };

  const stopAndServe = async () => {
    if (!state.isCooking) return;
    
    setState(prev => ({ ...prev, isCooking: false, loading: true }));
    
    const result = await judgeDish(
      state.selectedIngredients,
      state.timer,
      state.heatLevel
    );
    
    setState(prev => ({ ...prev, result, loading: false }));
  };

  const reset = () => {
    setState({
      selectedIngredients: [],
      isCooking: false,
      heatLevel: 'medium',
      timer: 0,
      result: null,
      loading: false,
    });
  };

  useEffect(() => {
    if (state.isCooking) {
      // Fixed: Explicitly cast to any/number for compatibility across environments
      timerRef.current = setInterval(() => {
        setState(prev => ({ ...prev, timer: prev.timer + 1 }));
      }, 1000) as unknown as number;
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.isCooking]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-orange-50">
      {/* Background Stylized Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 text-8xl">🍳</div>
        <div className="absolute bottom-10 right-10 text-8xl">🥗</div>
        <div className="absolute top-1/2 left-1/4 text-6xl">🧂</div>
        <div className="absolute bottom-1/4 right-1/4 text-6xl">🔪</div>
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 z-10">
        
        {/* Left: Chef & Stove Area */}
        <div className="lg:col-span-7 flex flex-col items-center space-y-8">
          
          {/* Chef Section */}
          <div className="relative group">
            <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-orange-200 overflow-hidden">
               {/* Chef Maya Emoji Avatar */}
               <div className="text-9xl transition-transform transform group-hover:scale-110">
                 {state.isCooking ? '👩‍🍳' : '👧'}
               </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-white px-4 py-2 rounded-full shadow-md border border-orange-100">
               <span className="font-bold text-orange-600 italic">Chef Maya</span>
            </div>
          </div>

          {/* Stove Section */}
          <div className="w-full bg-slate-800 rounded-3xl p-8 shadow-2xl border-t-8 border-slate-700 relative">
            {/* The Pan */}
            <div className={`w-full h-40 bg-slate-600 rounded-full flex flex-wrap items-center justify-center p-4 shadow-inner relative z-10 transition-all duration-300 ${state.isCooking ? 'sizzle-animation' : ''}`}>
               {state.selectedIngredients.length === 0 ? (
                 <p className="text-slate-400 font-medium">Add ingredients to the pan...</p>
               ) : (
                 state.selectedIngredients.map(ing => (
                   <span key={ing.id} className="text-4xl m-1 filter drop-shadow-md">
                     {ing.emoji}
                   </span>
                 ))
               )}
               <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-24 h-4 bg-slate-700 rounded-r-lg shadow-lg"></div>
            </div>

            {/* Fire Element */}
            <div className="mt-4 flex justify-center space-x-2 h-16">
              {state.isCooking && Array.from({ length: 12 }).map((_, i) => (
                <div 
                  key={i}
                  className={`w-4 bg-orange-500 rounded-t-full flame-animation`}
                  style={{
                    height: `${Math.random() * (state.heatLevel === 'high' ? 60 : state.heatLevel === 'medium' ? 40 : 20) + 20}px`,
                    animationDelay: `${i * 0.05}s`,
                    backgroundColor: state.heatLevel === 'high' ? '#ef4444' : '#f97316'
                  }}
                />
              ))}
            </div>

            {/* Stove Controls */}
            <div className="mt-8 flex items-center justify-between">
              <div className="flex space-x-2">
                {(Object.keys(HEAT_SETTINGS) as HeatLevel[]).map(level => (
                  <button
                    key={level}
                    onClick={() => setState(s => ({ ...s, heatLevel: level }))}
                    disabled={state.isCooking}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${
                      state.heatLevel === level 
                        ? 'bg-orange-500 text-white shadow-lg' 
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    {level.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="flex space-x-4">
                 <div className="text-white font-mono text-2xl bg-black px-4 py-2 rounded-md border border-slate-600">
                    {state.timer}s
                 </div>
                 
                 {!state.isCooking ? (
                   <button
                     onClick={startCooking}
                     disabled={state.selectedIngredients.length === 0 || state.loading}
                     className="bg-green-500 hover:bg-green-600 text-white font-black px-8 py-3 rounded-full shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
                   >
                     COOK! 🔥
                   </button>
                 ) : (
                   <button
                     onClick={stopAndServe}
                     className="bg-red-500 hover:bg-red-600 text-white font-black px-8 py-3 rounded-full shadow-lg transition-transform animate-pulse"
                   >
                     SERVE 🍽️
                   </button>
                 )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Shelf Area */}
        <div className="lg:col-span-5 bg-white/80 backdrop-blur rounded-3xl p-6 shadow-xl border border-orange-100 h-fit">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-orange-800">Ingredient Shelf</h2>
              <span className="text-sm font-bold bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                {state.selectedIngredients.length} / 5
              </span>
           </div>
           
           <div className="grid grid-cols-3 gap-4">
              {INGREDIENTS.map(ing => {
                const isSelected = state.selectedIngredients.some(i => i.id === ing.id);
                return (
                  <button
                    key={ing.id}
                    onClick={() => toggleIngredient(ing)}
                    disabled={state.isCooking || state.loading}
                    className={`
                      relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all
                      ${isSelected ? 'ring-4 ring-orange-500 shadow-lg scale-95' : 'shadow-md hover:shadow-lg hover:-translate-y-1'}
                      ${ing.color}
                    `}
                  >
                    <span className="text-4xl mb-2">{ing.emoji}</span>
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-tighter">
                      {ing.name}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
                        <i className="fa-solid fa-check"></i>
                      </div>
                    )}
                  </button>
                );
              })}
           </div>

           <div className="mt-8">
              <button 
                onClick={reset}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition-colors"
              >
                Clear Pan
              </button>
           </div>
        </div>
      </div>

      {/* Results Overlay */}
      {(state.loading || state.result) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] p-8 max-w-lg w-full shadow-2xl border-4 border-orange-400 relative overflow-hidden">
            {state.loading ? (
              <div className="flex flex-col items-center py-12">
                 <div className="animate-spin text-6xl mb-6">🥘</div>
                 <h2 className="text-2xl font-black text-orange-600 animate-pulse">
                   Tasting your creation...
                 </h2>
                 <p className="text-gray-500 italic mt-2">Gemini is judging you.</p>
              </div>
            ) : state.result && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl mb-4">🏆</div>
                  <h2 className="text-3xl font-black text-gray-900 leading-tight">
                    {state.result.dishName}
                  </h2>
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <span className="bg-orange-100 text-orange-700 px-4 py-1 rounded-full font-black text-lg">
                      {state.result.rating}
                    </span>
                    <span className="text-gray-400 font-bold">•</span>
                    <span className="text-yellow-500 font-black text-xl">
                      {state.result.score}/10
                    </span>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-2xl p-6 border-l-8 border-orange-400">
                   <p className="text-gray-700 leading-relaxed italic">
                     "{state.result.critique}"
                   </p>
                </div>

                <button
                  onClick={reset}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-xl transition-transform hover:scale-105"
                >
                  COOK AGAIN! 🍳
                </button>
              </div>
            )}
            
            {/* Visual Flare for result */}
            <div className="absolute -bottom-10 -right-10 opacity-20 text-9xl">👩‍🍳</div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-8 text-orange-400 font-bold text-sm flex items-center space-x-4">
        <span><i className="fa-solid fa-fire mr-1"></i> Control the Heat</span>
        <span><i className="fa-solid fa-clock mr-1"></i> Watch the Time</span>
        <span><i className="fa-solid fa-robot mr-1"></i> AI Critiques</span>
      </div>
    </div>
  );
}
