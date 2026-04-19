import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
    trip: 'oneway',
    from: null,
    to: null,
    selectedAirport: { from: null, to: null },
    selectedFlight: null,
    selectedSeat: null,
    view: 'home',
    currentFlights: [],
    activeAirlines: [], // Convert Set to Array for React compatibility
    activeStops: ['nonstop', 'stops'],
    theme: localStorage.getItem('skyvoyage-theme') || 'dark',
    notifications: [],
    passengers: [
        { id: 1, name: 'Voyager Elite', type: 'Adult', seat: null },
        { id: 2, name: 'Passenger 2', type: 'Adult', seat: null }
    ],
    selectedSeats: {}, // { index: seatId }
    activePassenger: 0,
    currentStep: 'results',
    searchParams: { passengers: 2 }
};

function appReducer(state, action) {
    switch (action.type) {
        case 'SET_TRIP':
            return { ...state, trip: action.payload };
        case 'SET_AIRPORTS':
            return { 
                ...state, 
                from: action.payload.from, 
                to: action.payload.to 
            };
        case 'SET_VIEW':
            return { ...state, view: action.payload };
        case 'SET_FLIGHTS':
            return { ...state, currentFlights: action.payload };
        case 'SELECT_FLIGHT':
            return { ...state, selectedFlight: action.payload };
        case 'SELECT_SEAT':
            return { ...state, selectedSeat: action.payload };
        case 'TOGGLE_AIRLINE_FILTER':
            const newAirlines = state.activeAirlines.includes(action.payload)
                ? state.activeAirlines.filter(a => a !== action.payload)
                : [...state.activeAirlines, action.payload];
            return { ...state, activeAirlines: newAirlines };
        case 'TOGGLE_STOPS_FILTER':
            const newStops = state.activeStops.includes(action.payload)
                ? state.activeStops.filter(s => s !== action.payload)
                : [...state.activeStops, action.payload];
            return { ...state, activeStops: newStops };
        case 'TOGGLE_THEME':
            const newTheme = state.theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('skyvoyage-theme', newTheme);
            return { ...state, theme: newTheme };
        case 'ADD_NOTIFICATION':
            return { 
                ...state, 
                notifications: [...state.notifications, { id: Date.now(), ...action.payload }] 
            };
        case 'REMOVE_NOTIFICATION':
            return { 
                ...state, 
                notifications: state.notifications.filter(n => n.id !== action.payload) 
            };
        case 'SET_SEAT_SELECTION':
            return {
                ...state,
                selectedSeats: {
                    ...state.selectedSeats,
                    [action.payload.index]: action.payload.seatId
                },
                activePassenger: Math.min(state.activePassenger + 1, state.searchParams.passengers - 1)
            };
        case 'CONFIRM_SEATS':
            return {
                ...state,
                currentStep: action.payload.nextStep || 'booking'
            };
        case 'SET_CURRENT_STEP':
            return {
                ...state,
                currentStep: action.payload
            };
        case 'SET_ACTIVE_PASSENGER':
            return {
                ...state,
                activePassenger: action.payload
            };
        default:
            return state;
    }
}

export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Sync theme with DOM
    useEffect(() => {
        const html = document.documentElement;
        if (state.theme === 'light') {
            html.setAttribute('data-theme', 'light');
        } else {
            html.removeAttribute('data-theme');
        }
    }, [state.theme]);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
