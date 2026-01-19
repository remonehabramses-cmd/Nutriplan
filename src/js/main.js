// src/js/app.js
// Main application entry point

import { Utils } from './utils.js';
import { Navigation } from './navigation.js';
import { LogMealModal } from './logMealModal.js';
import { FoodLog } from './foodlog.js';
import { Meals } from './meals.js';
import { Products } from './products.js';
import { Nutrition } from './nutrition.js';

const App = {
    /**
     * Initialize the application
     */
    async initialize() {
        const startTime = Date.now();
        
        try {
            // Make modules globally available (for debugging and HTML onclick handlers)
            window.LogMealModal = LogMealModal;
            window.FoodLog = FoodLog;
            window.Meals = Meals;
            window.Nutrition = Nutrition;
            
            console.log('✅ Global modules loaded:', { LogMealModal, FoodLog, Meals, Nutrition });
            
            // Initialize navigation
            Navigation.initialize();
            
            // Initialize search functionality
            Meals.initializeSearch();
            Products.initializeProductSearch();
            Products.initializeNutriScoreFilter();
            
            // Load data from APIs
            await Promise.allSettled([
                Meals.loadCategories(),
                Meals.loadAreas(),
                Products.loadProductCategories()
            ]);
            
            // Initialize food log clear button
            this.initializeFoodLogClearButton();
            
            // Hide loading overlay after minimum time
            const elapsed = Date.now() - startTime;
            const minLoadTime = 1200;
            setTimeout(() => Utils.hideLoadingOverlay(), Math.max(0, minLoadTime - elapsed));
            
        } catch (err) {
            console.error('App initialization error:', err);
            Utils.hideLoadingOverlay();
        }
    },
    
    /**
     * Initialize food log clear button
     */
    initializeFoodLogClearButton() {
        const clearBtn = document.getElementById('clear-foodlog');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => FoodLog.clearAll());
        }
    }
};

// Initialize app when DOM is ready
window.addEventListener('DOMContentLoaded', () => App.initialize());