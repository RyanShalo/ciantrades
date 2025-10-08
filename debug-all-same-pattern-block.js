// Debug script for All Same Pattern Block
// Run this in the browser console when the bot is loaded

console.log('🎲 Debug: Starting All Same Pattern Block test...');

class AllSamePatternDebugger {
    constructor() {
        this.testResults = [];
        console.log('🎯 All Same Pattern Block Debugger Initialized');
    }

    // Check if the method is available
    checkMethodAvailability() {
        console.log('🔍 Checking method availability...');
        
        // Check Bot API
        if (typeof Bot !== 'undefined' && Bot.checkAllSamePattern) {
            console.log('✅ Bot.checkAllSamePattern method is available');
            return true;
        } else {
            console.log('❌ Bot.checkAllSamePattern method not found');
            return false;
        }
    }

    // Generate test data for different patterns
    generateTestData(pattern, count = 5) {
        console.log(`📊 Generating ${count} test ticks for pattern: ${pattern}...`);
        const digits = [];
        
        switch (pattern) {
            case 'all_even':
                for (let i = 0; i < count; i++) {
                    digits.push([0, 2, 4, 6, 8][Math.floor(Math.random() * 5)]);
                }
                break;
            case 'all_odd':
                for (let i = 0; i < count; i++) {
                    digits.push([1, 3, 5, 7, 9][Math.floor(Math.random() * 5)]);
                }
                break;
            case 'all_same':
                const digit = Math.floor(Math.random() * 10);
                for (let i = 0; i < count; i++) {
                    digits.push(digit);
                }
                break;
            case 'mixed':
                for (let i = 0; i < count; i++) {
                    digits.push(Math.floor(Math.random() * 10));
                }
                break;
        }
        
        console.log('Generated digits:', digits);
        return digits;
    }

    // Simulate pattern checking
    simulatePatternCheck() {
        console.log('🎯 Simulating pattern checks...');
        
        const testCases = [
            { pattern: 'all_even', count: 5, expectResult: true },
            { pattern: 'all_odd', count: 5, expectResult: true },
            { pattern: 'all_same', count: 5, expectResult: true },
            { pattern: 'mixed', count: 5, expectResult: false }
        ];
        
        testCases.forEach(testCase => {
            const digits = this.generateTestData(testCase.pattern, testCase.count);
            
            let result = false;
            switch (testCase.pattern) {
                case 'all_even':
                    result = digits.every(d => d % 2 === 0);
                    break;
                case 'all_odd':
                    result = digits.every(d => d % 2 !== 0);
                    break;
                case 'all_same':
                    result = digits.every(d => d === digits[0]);
                    break;
                case 'mixed':
                    // Mixed should fail pattern checks
                    result = false;
                    break;
            }
            
            console.log(`Pattern: ${testCase.pattern}, Result: ${result}, Expected: ${testCase.expectResult}`);
            console.log(`Digits: [${digits.join(', ')}]`);
        });
    }

    // Run comprehensive tests
    async runTests() {
        console.log('🚀 Running comprehensive All Same Pattern tests...');
        
        if (!this.checkMethodAvailability()) {
            console.log('❌ Cannot run tests - method not available');
            return;
        }
        
        const testCases = [
            { pattern: 'all_even', count: 5 },
            { pattern: 'all_odd', count: 5 },
            { pattern: 'all_same', count: 5 },
            { pattern: 'all_even', count: 10 },
            { pattern: 'all_odd', count: 10 },
            { pattern: 'all_same', count: 10 }
        ];
        
        for (const testCase of testCases) {
            try {
                console.log(`Testing: ${testCase.pattern} with ${testCase.count} ticks`);
                const result = await Bot.checkAllSamePattern(testCase.count, testCase.pattern);
                console.log(`✅ Result: ${result} (${result ? 'TRUE' : 'FALSE'})`);
                
                this.testResults.push({
                    pattern: testCase.pattern,
                    count: testCase.count,
                    result: result,
                    status: 'success'
                });
                
            } catch (error) {
                console.error(`❌ Test failed for ${testCase.pattern}:`, error);
                this.testResults.push({
                    pattern: testCase.pattern,
                    count: testCase.count,
                    error: error.message,
                    status: 'error'
                });
            }
        }
        
        this.printTestSummary();
    }

    // Mock calculation for testing
    calculateMockPattern(pattern, count) {
        const digits = this.generateTestData(pattern, count);
        
        let result = false;
        switch (pattern) {
            case 'all_even':
                result = digits.every(d => d % 2 === 0);
                break;
            case 'all_odd':
                result = digits.every(d => d % 2 !== 0);
                break;
            case 'all_same':
                result = digits.every(d => d === digits[0]);
                break;
        }
        
        return { result, digits };
    }

    // Monitor live data
    startMonitoring(interval = 5000) {
        console.log(`🔄 Starting pattern monitoring (every ${interval}ms)...`);
        
        this.monitoringInterval = setInterval(async () => {
            if (typeof Bot !== 'undefined' && Bot.checkAllSamePattern) {
                try {
                    const patterns = ['all_even', 'all_odd', 'all_same'];
                    for (const pattern of patterns) {
                        const result = await Bot.checkAllSamePattern(5, pattern);
                        console.log(`📊 ${pattern}: ${result}`);
                    }
                } catch (error) {
                    console.error('❌ Monitoring error:', error);
                }
            }
        }, interval);
    }

    // Stop monitoring
    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            console.log('⏹️ Pattern monitoring stopped');
        }
    }

    // Get current block state
    getCurrentState() {
        console.log('📊 Current All Same Pattern Block State:');
        console.log('Bot API Available:', typeof Bot !== 'undefined');
        console.log('checkAllSamePattern Method:', typeof Bot?.checkAllSamePattern);
        console.log('Blockly Available:', typeof window.Blockly !== 'undefined');
        console.log('Block Registered:', typeof window.Blockly?.Blocks?.all_same_pattern !== 'undefined');
        console.log('JavaScript Generator:', typeof window.Blockly?.JavaScript?.javascriptGenerator?.forBlock?.all_same_pattern !== 'undefined');
    }

    // Print test summary
    printTestSummary() {
        console.log('📋 Test Summary:');
        console.log('================');
        
        const successCount = this.testResults.filter(r => r.status === 'success').length;
        const errorCount = this.testResults.filter(r => r.status === 'error').length;
        
        console.log(`✅ Successful tests: ${successCount}`);
        console.log(`❌ Failed tests: ${errorCount}`);
        console.log(`📊 Total tests: ${this.testResults.length}`);
        
        if (errorCount > 0) {
            console.log('❌ Failed tests details:');
            this.testResults.filter(r => r.status === 'error').forEach(result => {
                console.log(`  - Pattern: ${result.pattern}, Count: ${result.count}, Error: ${result.error}`);
            });
        }
    }
}

// Create global debugger instance
window.allSamePatternDebugger = new AllSamePatternDebugger();

// Convenience functions for console use
window.checkAllSamePattern = () => window.allSamePatternDebugger.checkMethodAvailability();
window.testAllSamePattern = () => window.allSamePatternDebugger.runTests();
window.simulateAllSamePattern = () => window.allSamePatternDebugger.simulatePatternCheck();
window.monitorAllSamePattern = (interval) => window.allSamePatternDebugger.startMonitoring(interval);
window.stopMonitoringAllSamePattern = () => window.allSamePatternDebugger.stopMonitoring();
window.getAllSamePatternState = () => window.allSamePatternDebugger.getCurrentState();

// Run initial check
window.allSamePatternDebugger.getCurrentState();
window.allSamePatternDebugger.simulatePatternCheck();

console.log('🎯 All Same Pattern Block Debugger loaded!');
console.log('Available commands:');
console.log('  checkAllSamePattern() - Check if method is available');
console.log('  testAllSamePattern() - Run comprehensive tests');
console.log('  simulateAllSamePattern() - Simulate pattern checks');
console.log('  monitorAllSamePattern(interval) - Start live monitoring');
console.log('  stopMonitoringAllSamePattern() - Stop monitoring');
console.log('  getAllSamePatternState() - Get current state');
