// Debug script to test even/odd percentage data accuracy
// This should be run in the browser console when the bot is loaded

console.log('🔍 Debug: Starting even/odd percentage data accuracy test...');

// Test 1: Check if the symbol analyzer is working
console.log('📊 Test 1: Symbol Analyzer');
try {
    if (typeof symbolAnalyzer !== 'undefined') {
        console.log('✅ Symbol analyzer is available');
        
        // Test with some mock data
        const testSymbol = 'R_100';
        symbolAnalyzer.addTick(testSymbol, { quote: 123.45, epoch: Date.now() });
        symbolAnalyzer.addTick(testSymbol, { quote: 124.62, epoch: Date.now() });
        symbolAnalyzer.addTick(testSymbol, { quote: 125.73, epoch: Date.now() });
        
        const analysis = symbolAnalyzer.getAnalysis(testSymbol);
        console.log('📈 Symbol analysis:', analysis);
        
        const evenOddData = symbolAnalyzer.getEvenOddPercentage(testSymbol, 3);
        console.log('🎯 Even/Odd data from analyzer:', evenOddData);
    } else {
        console.log('❌ Symbol analyzer not available');
    }
} catch (error) {
    console.error('❌ Symbol analyzer test failed:', error);
}

// Test 2: Check if Bot API is working
console.log('🤖 Test 2: Bot API');
try {
    if (typeof Bot !== 'undefined' && Bot.getEvenOddPercentage) {
        console.log('✅ Bot.getEvenOddPercentage method is available');
        
        // Test the method
        Bot.getEvenOddPercentage('even', 10).then(result => {
            console.log('🎯 Bot API result for even percentage:', result);
        }).catch(error => {
            console.error('❌ Bot API test failed:', error);
        });
        
        Bot.getEvenOddPercentage('odd', 10).then(result => {
            console.log('🎯 Bot API result for odd percentage:', result);
        }).catch(error => {
            console.error('❌ Bot API test failed:', error);
        });
    } else {
        console.log('❌ Bot.getEvenOddPercentage method not available');
        console.log('Available Bot methods:', typeof Bot !== 'undefined' ? Object.keys(Bot) : 'Bot not defined');
    }
} catch (error) {
    console.error('❌ Bot API test failed:', error);
}

// Test 3: Check tick data flow
console.log('📡 Test 3: Tick Data Flow');
try {
    if (typeof api_base !== 'undefined' && api_base.api) {
        console.log('✅ API base is available');
        
        // Subscribe to ticks for a test symbol
        const testSymbol = 'R_100';
        
        api_base.api.send({
            ticks: testSymbol,
            subscribe: 1
        }).then(response => {
            console.log('📈 Tick subscription response:', response);
        }).catch(error => {
            console.error('❌ Tick subscription failed:', error);
        });
        
        // Listen for tick updates
        const tickListener = (response) => {
            if (response.tick && response.tick.symbol === testSymbol) {
                console.log('🎯 Received tick:', {
                    symbol: response.tick.symbol,
                    quote: response.tick.quote,
                    lastDigit: Math.abs(Math.floor(response.tick.quote * 10)) % 10,
                    isEven: (Math.abs(Math.floor(response.tick.quote * 10)) % 10) % 2 === 0
                });
            }
        };
        
        // Note: In actual implementation, you'd need to properly subscribe to the WebSocket
        console.log('📡 Tick listener ready (would need actual WebSocket subscription)');
        
    } else {
        console.log('❌ API base not available');
    }
} catch (error) {
    console.error('❌ Tick data flow test failed:', error);
}

// Test 4: Check if trade execution is working
console.log('💹 Test 4: Trade Execution Check');
try {
    // Check if purchase conditions are being met
    if (typeof window.dbot !== 'undefined' && window.dbot.interpreter) {
        console.log('✅ DBot interpreter is available');
        
        // Check bot state
        console.log('🤖 Bot state:', {
            isRunning: window.dbot.interpreter.isRunning,
            hasBlocks: window.dbot.interpreter.bot ? 'Yes' : 'No'
        });
        
    } else {
        console.log('❌ DBot interpreter not available');
    }
} catch (error) {
    console.error('❌ Trade execution check failed:', error);
}

// Test 5: Manual percentage calculation test
console.log('🧮 Test 5: Manual Calculation Test');
try {
    // Create test data with known pattern
    const testTicks = [
        { quote: 123.40 }, // 0 - even
        { quote: 124.51 }, // 1 - odd
        { quote: 125.62 }, // 2 - even
        { quote: 126.73 }, // 3 - odd
        { quote: 127.84 }, // 4 - even
        { quote: 128.95 }, // 5 - odd
        { quote: 129.06 }, // 6 - even
        { quote: 130.17 }, // 7 - odd
        { quote: 131.28 }, // 8 - even
        { quote: 132.39 }  // 9 - odd
    ];
    
    const digits = testTicks.map(tick => Math.abs(Math.floor(tick.quote * 10)) % 10);
    const evenCount = digits.filter(d => d % 2 === 0).length;
    const oddCount = digits.filter(d => d % 2 === 1).length;
    
    console.log('🔢 Test data digits:', digits);
    console.log('📊 Even count:', evenCount, '- Percentage:', (evenCount / digits.length * 100).toFixed(2) + '%');
    console.log('📊 Odd count:', oddCount, '- Percentage:', (oddCount / digits.length * 100).toFixed(2) + '%');
    
    // Expected: 50% even, 50% odd
    console.log('✅ Manual calculation test complete');
    
} catch (error) {
    console.error('❌ Manual calculation test failed:', error);
}

// Test 6: Check block execution
console.log('🧩 Test 6: Block Execution Test');
try {
    if (typeof window.Blockly !== 'undefined') {
        console.log('✅ Blockly is available');
        
        // Check if our block is registered
        if (window.Blockly.Blocks.even_odd_percentage) {
            console.log('✅ even_odd_percentage block is registered');
            
            // Check JavaScript generator
            if (window.Blockly.JavaScript.javascriptGenerator.forBlock.even_odd_percentage) {
                console.log('✅ JavaScript generator is registered');
                
                // Test code generation
                const mockBlock = {
                    getFieldValue: (field) => {
                        if (field === 'PATTERN') return 'even';
                        return null;
                    }
                };
                
                // Mock the value getter
                const originalValueToCode = window.Blockly.JavaScript.javascriptGenerator.valueToCode;
                window.Blockly.JavaScript.javascriptGenerator.valueToCode = (block, input) => {
                    if (input === 'COUNT') return '10';
                    return originalValueToCode ? originalValueToCode(block, input) : '';
                };
                
                const code = window.Blockly.JavaScript.javascriptGenerator.forBlock.even_odd_percentage(mockBlock);
                console.log('🎯 Generated code:', code);
                
                // Restore original function
                if (originalValueToCode) {
                    window.Blockly.JavaScript.javascriptGenerator.valueToCode = originalValueToCode;
                }
                
            } else {
                console.log('❌ JavaScript generator not found');
            }
        } else {
            console.log('❌ even_odd_percentage block not registered');
        }
    } else {
        console.log('❌ Blockly not available');
    }
} catch (error) {
    console.error('❌ Block execution test failed:', error);
}

console.log('🔍 Debug: Even/odd percentage data accuracy test complete!');
console.log('📋 Summary: Check above for any ❌ errors that might explain why trades are not executing.');
