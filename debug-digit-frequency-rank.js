// Digit Frequency Rank Block Debugging Tool
// Run this in browser console while bot is running

class DigitFrequencyRankDebugger {
    constructor() {
        this.testResults = [];
        console.log('📊 Digit Frequency Rank Block Debugger Initialized');
    }

    // Check if the method is available
    checkMethodAvailability() {
        console.log('🔍 Checking method availability...');
        
        if (window.Bot && window.Bot.getDigitFrequencyRank) {
            console.log('✅ Bot.getDigitFrequencyRank method is available');
            
            // Test method signature
            try {
                const testResult = window.Bot.getDigitFrequencyRank('most', 15);
                if (testResult && typeof testResult.then === 'function') {
                    console.log('✅ Method returns a Promise');
                    testResult.then(result => {
                        console.log(`✅ Test call successful: digit ${result}`);
                    }).catch(error => {
                        console.log(`❌ Test call failed: ${error.message}`);
                    });
                } else {
                    console.log('⚠️ Method does not return a Promise');
                }
            } catch (error) {
                console.error('❌ Error testing getDigitFrequencyRank:', error);
            }
        } else {
            console.log('❌ Bot.getDigitFrequencyRank method not available');
            console.log('Available Bot methods:', Object.keys(window.Bot || {}));
        }
    }

    // Generate test data with frequency analysis
    generateFrequencyTestData(count = 20) {
        console.log(`📊 Generating ${count} test ticks with frequency analysis...`);
        const digits = [];
        const digitCounts = new Array(10).fill(0);
        
        for (let i = 0; i < count; i++) {
            // Create realistic distribution with some bias
            let digit;
            const rand = Math.random();
            
            if (rand < 0.2) {
                digit = Math.floor(Math.random() * 3); // 0,1,2 bias
            } else if (rand < 0.4) {
                digit = Math.floor(Math.random() * 2) + 8; // 8,9 bias
            } else {
                digit = Math.floor(Math.random() * 10); // Any digit
            }
            
            digits.push(digit);
            digitCounts[digit]++;
        }
        
        // Sort by frequency for analysis
        const sorted = digitCounts.map((count, digit) => ({ digit, count }))
            .sort((a, b) => b.count !== a.count ? b.count - a.count : a.digit - b.digit);
        
        console.log('Generated digits:', digits);
        console.log('Frequency counts:', digitCounts);
        console.log('Sorted by frequency:', sorted);
        
        return { digits, digitCounts, sorted };
    }

    // Simulate frequency rank checking
    simulateFrequencyCheck() {
        console.log('🧪 Simulating frequency rank check...');
        
        if (window.Bot && window.Bot.getDigitFrequencyRank) {
            return Promise.all([
                window.Bot.getDigitFrequencyRank('most', 15),
                window.Bot.getDigitFrequencyRank('least', 15),
                window.Bot.getDigitFrequencyRank('second_most', 15),
                window.Bot.getDigitFrequencyRank('second_least', 15)
            ]).then(([most, least, secondMost, secondLeast]) => {
                console.log(`📈 Current frequency analysis:`);
                console.log(`  Most frequent: ${most}`);
                console.log(`  Second most: ${secondMost}`);
                console.log(`  Second least: ${secondLeast}`);
                console.log(`  Least frequent: ${least}`);
                
                // Generate trading signals
                const signals = this.generateTradingSignals(most, least, secondMost, secondLeast);
                console.log(`🎯 Trading signals:`, signals);
                
                return { most, least, secondMost, secondLeast, signals };
            }).catch(error => {
                console.error('❌ Error in frequency check:', error);
                return null;
            });
        } else {
            console.log('❌ Cannot simulate - Bot.getDigitFrequencyRank not available');
            return Promise.resolve(null);
        }
    }

    // Generate trading signals based on frequency ranks
    generateTradingSignals(most, least, secondMost, secondLeast) {
        const signals = [];
        
        // High digit bias strategy
        if (most >= 7) {
            signals.push({
                type: 'HIGH_DIGIT_BIAS',
                action: 'Consider Over trades',
                confidence: most >= 8 ? 'HIGH' : 'MEDIUM',
                reason: `Most frequent digit is ${most} (high range)`
            });
        }
        
        // Low digit bias strategy
        if (most <= 2) {
            signals.push({
                type: 'LOW_DIGIT_BIAS',
                action: 'Consider Under trades',
                confidence: most <= 1 ? 'HIGH' : 'MEDIUM',
                reason: `Most frequent digit is ${most} (low range)`
            });
        }
        
        // Extreme avoidance strategy
        if (least === 0 || least === 9) {
            signals.push({
                type: 'EXTREME_AVOIDANCE',
                action: `Avoid digit ${least}`,
                confidence: 'MEDIUM',
                reason: `Digit ${least} is least frequent (extreme value)`
            });
        }
        
        // Range concentration
        const range = Math.abs(most - least);
        if (range <= 3) {
            signals.push({
                type: 'RANGE_CONCENTRATION',
                action: 'Narrow range detected',
                confidence: 'LOW',
                reason: `Frequency range span: ${range} digits`
            });
        }
        
        return signals;
    }

    // Run comprehensive tests
    async runTests() {
        console.log('🚀 Starting comprehensive frequency rank tests...');
        
        const testCases = [
            { rank: 'most', count: 15, description: 'Most frequent digit in 15 ticks' },
            { rank: 'least', count: 15, description: 'Least frequent digit in 15 ticks' },
            { rank: 'second_most', count: 20, description: 'Second most frequent in 20 ticks' },
            { rank: 'second_least', count: 20, description: 'Second least frequent in 20 ticks' },
            { rank: 'most', count: 30, description: 'Most frequent in 30 ticks (large sample)' },
            { rank: 'least', count: 10, description: 'Least frequent in 10 ticks (small sample)' }
        ];

        for (let i = 0; i < testCases.length; i++) {
            const { rank, count, description } = testCases[i];
            console.log(`\nTest ${i + 1}/6: ${description}`);
            console.log(`Parameters: rank='${rank}', count=${count}`);
            
            try {
                if (window.Bot && window.Bot.getDigitFrequencyRank) {
                    const result = await window.Bot.getDigitFrequencyRank(rank, count);
                    console.log(`✅ Result: digit ${result}`);
                    this.testResults.push({ 
                        test: description, 
                        parameters: { rank, count },
                        result: result,
                        status: 'success' 
                    });
                } else {
                    // Use mock calculation
                    const mockResult = this.calculateMockFrequencyRank(rank, count);
                    console.log(`📝 Mock result: digit ${mockResult}`);
                    this.testResults.push({ 
                        test: description, 
                        parameters: { rank, count },
                        result: mockResult,
                        status: 'mock' 
                    });
                }
            } catch (error) {
                console.error(`❌ Test failed: ${error.message}`);
                this.testResults.push({ 
                    test: description, 
                    parameters: { rank, count },
                    error: error.message,
                    status: 'error' 
                });
            }
            
            // Small delay between tests
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        console.log('\n📊 Test Summary:');
        console.table(this.testResults);
    }

    // Mock calculation for testing
    calculateMockFrequencyRank(rank, count) {
        const { digitCounts, sorted } = this.generateFrequencyTestData(count);
        
        switch (rank) {
            case 'most':
                return sorted[0].digit;
            case 'least':
                return sorted[sorted.length - 1].digit;
            case 'second_most':
                return sorted.length > 1 ? sorted[1].digit : sorted[0].digit;
            case 'second_least':
                return sorted.length > 1 ? sorted[sorted.length - 2].digit : sorted[sorted.length - 1].digit;
            default:
                return sorted[0].digit;
        }
    }

    // Monitor live frequency data
    startFrequencyMonitoring(interval = 5000) {
        console.log(`📡 Starting live frequency monitoring (${interval}ms intervals)...`);
        
        this.monitoringInterval = setInterval(() => {
            if (window.Bot && window.Bot.getDigitFrequencyRank) {
                Promise.all([
                    window.Bot.getDigitFrequencyRank('most', 15),
                    window.Bot.getDigitFrequencyRank('least', 15)
                ]).then(([mostFrequent, leastFrequent]) => {
                    console.log(`📊 Live Frequency Data - Most: ${mostFrequent}, Least: ${leastFrequent}`);
                    
                    // Alert on interesting patterns
                    if (mostFrequent === leastFrequent) {
                        console.log('🔔 Alert: Most and least frequent digits are the same!');
                    }
                    
                    if (mostFrequent >= 8 || mostFrequent <= 1) {
                        console.log(`🔔 Alert: Extreme digit bias detected (digit ${mostFrequent})`);
                    }
                }).catch(error => {
                    console.error('❌ Monitoring error:', error);
                });
            }
        }, interval);
        
        console.log('✅ Frequency monitoring started. Call stopFrequencyMonitoring() to stop.');
    }

    // Stop monitoring
    stopFrequencyMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            console.log('⏹️ Frequency monitoring stopped');
        }
    }

    // Get current frequency analysis
    getCurrentFrequencyAnalysis() {
        console.log('📋 Current Frequency Analysis:');
        console.log('- Method Available:', !!(window.Bot && window.Bot.getDigitFrequencyRank));
        console.log('- Bot Object:', !!window.Bot);
        
        if (window.Bot && window.Bot.getDigitFrequencyRank) {
            console.log('🔗 Testing live frequency analysis...');
            return this.simulateFrequencyCheck();
        }
        
        return Promise.resolve(null);
    }

    // Trading strategy analyzer
    analyzeFrequencyStrategy(tickCount = 20) {
        console.log(`📊 Analyzing frequency-based trading strategy for ${tickCount} ticks...`);
        
        if (window.Bot && window.Bot.getDigitFrequencyRank) {
            return Promise.all([
                window.Bot.getDigitFrequencyRank('most', tickCount),
                window.Bot.getDigitFrequencyRank('second_most', tickCount),
                window.Bot.getDigitFrequencyRank('second_least', tickCount),
                window.Bot.getDigitFrequencyRank('least', tickCount)
            ]).then(([most, secondMost, secondLeast, least]) => {
                console.log('🎯 Frequency Strategy Analysis:');
                console.log(`  Distribution: ${least} ← ${secondLeast} ← ${secondMost} ← ${most}`);
                
                // Strategy recommendations
                const strategies = [];
                
                if (most >= 7) {
                    strategies.push('HIGH_DIGIT_MOMENTUM: Consider Over trades based on high digit dominance');
                }
                
                if (least <= 2) {
                    strategies.push('LOW_DIGIT_AVOIDANCE: Avoid Under trades, low digits underrepresented');
                }
                
                const spread = most - least;
                if (spread >= 6) {
                    strategies.push('WIDE_SPREAD: Large frequency range suggests volatility');
                } else if (spread <= 2) {
                    strategies.push('NARROW_SPREAD: Tight frequency range suggests consolidation');
                }
                
                console.log('📈 Recommended Strategies:');
                strategies.forEach((strategy, i) => {
                    console.log(`  ${i + 1}. ${strategy}`);
                });
                
                return { most, secondMost, secondLeast, least, strategies };
            });
        } else {
            console.log('❌ Cannot analyze - method not available');
            return Promise.resolve(null);
        }
    }
}

// Auto-initialize debugger
const frequencyRankDebugger = new DigitFrequencyRankDebugger();

// Convenience functions
window.checkFrequencyRank = () => frequencyRankDebugger.checkMethodAvailability();
window.testFrequencyRank = () => frequencyRankDebugger.runTests();
window.monitorFrequency = (interval) => frequencyRankDebugger.startFrequencyMonitoring(interval);
window.stopFrequencyMonitor = () => frequencyRankDebugger.stopFrequencyMonitoring();
window.frequencyAnalysis = () => frequencyRankDebugger.getCurrentFrequencyAnalysis();
window.frequencyStrategy = (count) => frequencyRankDebugger.analyzeFrequencyStrategy(count);

console.log('📊 Frequency Rank Debug Functions Available:');
console.log('- checkFrequencyRank() - Check method availability');
console.log('- testFrequencyRank() - Run comprehensive tests');
console.log('- monitorFrequency(interval) - Start live monitoring');
console.log('- stopFrequencyMonitor() - Stop monitoring');
console.log('- frequencyAnalysis() - Get current analysis');
console.log('- frequencyStrategy(count) - Analyze trading strategy');

// Auto-run initial check
frequencyRankDebugger.checkMethodAvailability();
