/**
 * Debug script for digit_comparison block
 * Use this to test the block in the browser console
 */

// Test the digit comparison block with sample data
function debugDigitComparison() {
    console.log('🔍 Debug: Testing digit_comparison block');
    
    // Test cases with different scenarios
    const testScenarios = [
        {
            name: 'Equal comparison - All 7s',
            description: 'Check if last 3 digits are all equal to 7',
            ticks: [1.2347, 1.2357, 1.2367],
            count: 3,
            operator: 'equal',
            digit: 7
        },
        {
            name: 'Greater than comparison',
            description: 'Check if last 4 digits are all greater than 5',
            ticks: [1.2346, 1.2357, 1.2368, 1.2379],
            count: 4,
            operator: 'greater',
            digit: 5
        },
        {
            name: 'Less than comparison',
            description: 'Check if last 3 digits are all less than 5',
            ticks: [1.2341, 1.2342, 1.2343],
            count: 3,
            operator: 'less',
            digit: 5
        },
        {
            name: 'Mixed digits test',
            description: 'Check if last 5 digits are all ≥ 3 (should fail)',
            ticks: [1.2341, 1.2352, 1.2361, 1.2374, 1.2382],
            count: 5,
            operator: 'greater_equal',
            digit: 3
        }
    ];
    
    testScenarios.forEach((scenario, index) => {
        console.log(`\n--- Test ${index + 1}: ${scenario.name} ---`);
        console.log(`Description: ${scenario.description}`);
        console.log(`Sample ticks: [${scenario.ticks.join(', ')}]`);
        
        // Extract digits for visualization
        const digits = scenario.ticks.map(tick => {
            const str = tick.toString();
            return parseInt(str.charAt(str.length - 1));
        }).slice(-scenario.count);
        
        console.log(`Last ${scenario.count} digits: [${digits.join(', ')}]`);
        console.log(`Operator: ${scenario.operator}, Target: ${scenario.digit}`);
        
        // Show the expected Blockly code
        console.log(`Blockly call: Bot.checkDigitComparison(${scenario.count}, '${scenario.operator}', ${scenario.digit})`);
        
        // Manual calculation for verification
        let result = false;
        const target = scenario.digit;
        
        switch (scenario.operator) {
            case 'equal':
                result = digits.every(d => d === target);
                break;
            case 'greater':
                result = digits.every(d => d > target);
                break;
            case 'less':
                result = digits.every(d => d < target);
                break;
            case 'greater_equal':
                result = digits.every(d => d >= target);
                break;
            case 'less_equal':
                result = digits.every(d => d <= target);
                break;
        }
        
        console.log(`Expected result: ${result ? '✅ true' : '❌ false'}`);
    });
    
    console.log('\n🎯 Usage in Trading Strategy:');
    console.log('if (Bot.checkDigitComparison(5, "equal", 7)) {');
    console.log('    // All last 5 digits are 7 - strong pattern detected');
    console.log('    purchase("DIGITEVEN");');
    console.log('}');
    
    console.log('\nif (Bot.checkDigitComparison(3, "greater", 6)) {');
    console.log('    // All last 3 digits are > 6 (7, 8, or 9)');
    console.log('    purchase("DIGITHIGH");');
    console.log('}');
}

// Run the debug function
debugDigitComparison();

// Helper function to test in browser console with actual Bot instance
function testWithBot() {
    if (typeof Bot !== 'undefined') {
        console.log('🤖 Testing with actual Bot instance...');
        
        // Test equal comparison
        Bot.checkDigitComparison(3, 'equal', 5).then(result => {
            console.log(`Last 3 digits equal to 5: ${result}`);
        });
        
        // Test greater than comparison
        Bot.checkDigitComparison(5, 'greater', 4).then(result => {
            console.log(`Last 5 digits greater than 4: ${result}`);
        });
        
        // Test less than comparison
        Bot.checkDigitComparison(4, 'less', 6).then(result => {
            console.log(`Last 4 digits less than 6: ${result}`);
        });
    } else {
        console.log('❌ Bot instance not available. Run this in the trading environment.');
    }
}

// Export for browser console usage
if (typeof window !== 'undefined') {
    window.testDigitComparison = testWithBot;
    window.debugDigitComparison = debugDigitComparison;
}
