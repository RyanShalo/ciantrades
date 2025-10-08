document.addEventListener('DOMContentLoaded', () => {
    const wallet = document.querySelector('.wallet');

    // Configuration
    const TARGET_APP_ID = 70827; // App ID to filter markup statistics

    if (!wallet) {
        console.error("⚠ Wallet element not found. Ensure the element with class 'wallet' exists in the HTML.");
        return;
    }

    console.log(`✅ Wallet element found. Initializing WebSocket for App ID ${TARGET_APP_ID}...`);

    // WebSocket connection
    const apiToken = 'uT4oMU9WykXTcV4'; // Replace with your actual token
    const appId = 52152;
    const accountNumber = 'CR4071525';
    const ws = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${appId}`);

    const statistics = {
        daily: { markup: 0, runs: 0 },
        weekly: { markup: 0, runs: 0 },
        monthly: { markup: 0, runs: 0 },
        currentMonth: 0,
    };

    const dailyData = [];
    let completedRequests = 0;
    let usdToKes = 130; // Default exchange rate, will be updated with real rate
    let lastUpdated = null; // Track when the rate was last updated

    // Fetch current USD to KES exchange rate
    async function fetchExchangeRate() {
        try {
            // Using CurrencyAPI service
            const apiKey = 'cur_live_qvPEAOO91Efa6GVvG5KCELMg2YV2sJrhd8DTZ7Jf'; // Replace with your actual CurrencyAPI key
            const response = await fetch(
                `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&currencies=KES&base_currency=USD`
            );
            const data = await response.json();

            if (data.data && data.data.KES) {
                usdToKes = data.data.KES.value;
                lastUpdated = data.meta?.last_updated_at;
                console.log(`💱 Exchange rate updated via CurrencyAPI: 1 USD = ${usdToKes} KES`);
                console.log(`📅 Last updated: ${lastUpdated || 'Unknown'}`);
            } else {
                throw new Error('KES rate not found in response');
            }

            updateStatisticsUI(); // Update UI with new rate
        } catch (error) {
            console.warn('⚠ Failed to fetch exchange rate from CurrencyAPI, trying fallback:', error);

            // Fallback to exchangerate-api.com
            try {
                const fallbackResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
                const fallbackData = await fallbackResponse.json();
                usdToKes = fallbackData.rates.KES || 130;
                lastUpdated = fallbackData.date || new Date().toISOString();
                console.log(`💱 Fallback exchange rate: 1 USD = ${usdToKes} KES`);
                updateStatisticsUI();
            } catch (fallbackError) {
                console.warn('⚠ Both APIs failed, using default rate of 130 KES per USD');
                usdToKes = 130;
                lastUpdated = 'Default rate';
                updateStatisticsUI();
            }
        }
    }

    // Convert USD to KES
    function convertToKes(usdAmount) {
        return usdAmount * usdToKes;
    }

    // Format currency
    function formatCurrency(amount, currency = 'USD') {
        if (currency === 'KES') {
            return `KES ${amount.toLocaleString('en-KE', { maximumFractionDigits: 0 })}`;
        }
        return `$${amount.toFixed(2)}`;
    }

    // Format update time for exchange rate
    function formatUpdateTime(timestamp) {
        if (timestamp === 'Default rate') return 'Default rate';

        try {
            const date = new Date(timestamp);
            const now = new Date();
            const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

            if (diffInHours < 1) {
                return 'Just now';
            } else if (diffInHours < 24) {
                return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
            } else {
                return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
                });
            }
        } catch (error) {
            return 'Unknown';
        }
    }

    // Initialize exchange rate
    fetchExchangeRate();

    // Show loading state initially
    wallet.innerHTML = `
        <div class="wallet-header">Portfolio Overview - App ID ${TARGET_APP_ID}</div>
        <div class="loading">Loading data...</div>
    `;

    ws.onopen = function () {
        console.log('✅ WebSocket connected, authorizing...');
        ws.send(JSON.stringify({ authorize: apiToken }));
    };

    ws.onmessage = function (event) {
        const response = JSON.parse(event.data);
        console.log('🔹 Full API Response:', response);

        if (response.msg_type === 'authorize') {
            console.log('✅ Authorization successful!');
            fetchEachDayMarkup();
            fetchMarkupStatistics('daily');
            fetchMarkupStatistics('weekly');
            fetchMarkupStatistics('monthly');
        } else if (response.msg_type === 'app_markup_statistics') {
            console.log('📊 Processing app_markup_statistics response...');
            
            // Filter markup data for app_id 70827 only
            let filteredMarkup = 0;
            let filteredRuns = 0;
            
            if (response.app_markup_statistics?.breakdown) {
                const appData = response.app_markup_statistics.breakdown.find(app => app.app_id === TARGET_APP_ID);
                if (appData) {
                    filteredMarkup = appData.app_markup_usd ?? 0;
                    filteredRuns = appData.transactions_count ?? 0;
                    console.log(`📊 Found data for app_id ${TARGET_APP_ID}:`, appData);
                } else {
                    console.log(`⚠ No data found for app_id ${TARGET_APP_ID} in breakdown`);
                }
            } else {
                console.log('⚠ No breakdown data available in response');
            }

            // Handle 30-day data
            if (response.req_id >= 1 && response.req_id <= 30) {
                const date = response.echo_req.date_from.split(' ')[0]; // Extract only the date part
                dailyData.push({ date, markup: filteredMarkup });
                completedRequests++;

                // Check if all requests are completed
                if (completedRequests === 30) {
                    console.log('📊 All 30-day data fetched:', dailyData);

                    // Sort data by date (ascending)
                    dailyData.sort((a, b) => new Date(a.date) - new Date(b.date));

                    // Render graph
                    renderGraph(dailyData);
                }
            }

            // Handle daily, weekly, and monthly statistics
            if (response.req_id === 100) {
                statistics.daily.markup = filteredMarkup;
                statistics.daily.runs = filteredRuns;
                console.log('📊 Updated Daily Statistics:', statistics.daily);
            }
            if (response.req_id === 101) {
                statistics.weekly.markup = filteredMarkup;
                statistics.weekly.runs = filteredRuns;
                console.log('📊 Updated Weekly Statistics:', statistics.weekly);
            }
            if (response.req_id === 102) {
                statistics.monthly.markup = filteredMarkup;
                statistics.monthly.runs = filteredRuns;
                statistics.currentMonth = filteredMarkup;
                console.log('📊 Updated Monthly Statistics:', statistics.monthly);
            }

            updateStatisticsUI();
        }
    };

    ws.onerror = function (error) {
        console.error('⚠ WebSocket Error:', error);
    };

    ws.onclose = function () {
        console.log('🔴 WebSocket disconnected.');
    };

    function fetchEachDayMarkup() {
        const dateRanges = getLast30DaysDateRanges();
        let reqIdCounter = 1; // Start with 1 for unique integer req_id

        dateRanges.forEach(({ date_from, date_to }) => {
            const request = {
                app_markup_statistics: 1,
                date_from,
                date_to,
                loginid: accountNumber,
                req_id: reqIdCounter++, // Use an incrementing integer for req_id
            };

            console.log(`📢 Requesting 30-day data for ${date_from} to ${date_to} with req_id ${request.req_id}...`);
            ws.send(JSON.stringify(request));
        });
    }

    function renderGraph(data) {
        if (!data || data.length === 0) {
            console.warn('⚠ No data provided to renderGraph.');
            return;
        }

        const ctx = document.getElementById('markupGraph').getContext('2d');
        const labels = data.map(entry => {
            const date = new Date(entry.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        const values = data.map(entry => entry.markup);

        console.log('📊 Rendering Graph with Labels:', labels);
        console.log('📊 Rendering Graph with Values:', values);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Daily Markup (USD)',
                        data: values,
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        pointBackgroundColor: '#667eea',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 8,
                        fill: true,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 10,
                        bottom: 10,
                        left: 10,
                        right: 10,
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#667eea',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function (context) {
                                const usd = context.parsed.y;
                                const kes = convertToKes(usd);
                                return [
                                    `USD: $${usd.toFixed(2)}`,
                                    `KES: ${kes.toLocaleString('en-KE', { maximumFractionDigits: 0 })}`,
                                ];
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            color: '#666',
                            font: {
                                size: 12,
                            },
                        },
                    },
                    y: {
                        grid: {
                            color: 'rgba(102, 126, 234, 0.1)',
                            borderDash: [5, 5],
                        },
                        ticks: {
                            color: '#666',
                            font: {
                                size: 12,
                            },
                            callback: function (value) {
                                return '$' + value.toFixed(0);
                            },
                        },
                    },
                },
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
            },
        });
    }

    function getLast30DaysDateRanges() {
        const dateRanges = [];
        const now = new Date();
        for (let i = 0; i < 30; i++) {
            const startDate = new Date(
                Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i, 0, 0, 0)
            );
            const endDate = new Date(
                Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i, 23, 59, 59)
            );
            dateRanges.push({
                date_from: formatDate(startDate),
                date_to: formatDate(endDate),
            });
        }
        return dateRanges;
    }

    function formatDate(date) {
        return new Date(date.getTime()).toISOString().slice(0, 19).replace('T', ' ');
    }

    function fetchMarkupStatistics(type) {
        const { date_from, date_to } = getDateRange(type);
        const reqIdMap = { daily: 100, weekly: 101, monthly: 102 };
        const reqId = reqIdMap[type];

        const request = {
            app_markup_statistics: 1,
            date_from,
            date_to,
            loginid: accountNumber,
            req_id: reqId,
        };

        console.log(`📢 Requesting ${type} statistics with req_id ${reqId}...`);
        ws.send(JSON.stringify(request));
    }

    function predictCurrentMonthMarkup() {
        const totalDays = dailyData.length;
        if (totalDays === 0) {
            console.warn('⚠ No data available for prediction.');
            return 0;
        }

        const totalMarkup = dailyData.reduce((sum, entry) => sum + entry.markup, 0);
        const averageDailyMarkup = totalMarkup / totalDays;

        const now = new Date();
        const daysInMonth = new Date(now.getUTCFullYear(), now.getUTCMonth() + 1, 0).getUTCDate();
        const predictedMarkup = averageDailyMarkup * daysInMonth;

        console.log('📊 Predicted Current Month Markup:', predictedMarkup);
        return predictedMarkup;
    }

    function updateStatisticsUI() {
        console.log('📊 Updating wallet UI with statistics:', statistics);

        const predictedMarkup = predictCurrentMonthMarkup();

        wallet.innerHTML = `
            <div class="wallet-header">Portfolio Overview</div>
            
            <div class="summary-cards">
                <div class="summary-card">
                    <h3>Current Month</h3>
                    <div class="usd">${formatCurrency(statistics.currentMonth)}</div>
                    <div class="kes">${formatCurrency(convertToKes(statistics.currentMonth), 'KES')}</div>
                </div>
                <div class="summary-card">
                    <h3>Predicted Month</h3>
                    <div class="usd">${formatCurrency(predictedMarkup)}</div>
                    <div class="kes">${formatCurrency(convertToKes(predictedMarkup), 'KES')}</div>
                </div>
            </div>
            
            <div class="stats-grid">
                <div class="stat">
                    <div class="stat-header">
                        <div class="stat-title">Daily Performance</div>
                        <div class="stat-period">Today</div>
                    </div>
                    <div class="stat-values">
                        <div class="stat-value">
                            <div class="label">USD</div>
                            <div class="amount usd">${formatCurrency(statistics.daily.markup)}</div>
                        </div>
                        <div class="stat-value">
                            <div class="label">KES</div>
                            <div class="amount kes">${formatCurrency(convertToKes(statistics.daily.markup), 'KES')}</div>
                        </div>
                    </div>
                    <div class="stat-runs">Transactions: ${statistics.daily.runs}</div>
                </div>
                
                <div class="stat">
                    <div class="stat-header">
                        <div class="stat-title">Weekly Performance</div>
                        <div class="stat-period">7 Days</div>
                    </div>
                    <div class="stat-values">
                        <div class="stat-value">
                            <div class="label">USD</div>
                            <div class="amount usd">${formatCurrency(statistics.weekly.markup)}</div>
                        </div>
                        <div class="stat-value">
                            <div class="label">KES</div>
                            <div class="amount kes">${formatCurrency(convertToKes(statistics.weekly.markup), 'KES')}</div>
                        </div>
                    </div>
                    <div class="stat-runs">Transactions: ${statistics.weekly.runs}</div>
                </div>
                
                <div class="stat">
                    <div class="stat-header">
                        <div class="stat-title">Monthly Performance</div>
                        <div class="stat-period">30 Days</div>
                    </div>
                    <div class="stat-values">
                        <div class="stat-value">
                            <div class="label">USD</div>
                            <div class="amount usd">${formatCurrency(statistics.monthly.markup)}</div>
                        </div>
                        <div class="stat-value">
                            <div class="label">KES</div>
                            <div class="amount kes">${formatCurrency(convertToKes(statistics.monthly.markup), 'KES')}</div>
                        </div>
                    </div>
                    <div class="stat-runs">Transactions: ${statistics.monthly.runs}</div>
                </div>
            </div>
            
            <div style="margin-top: 20px; text-align: center; font-size: 0.8rem; color: #666;">
                Exchange Rate: 1 USD = ${usdToKes.toFixed(2)} KES<br>
                <span style="font-size: 0.7rem; opacity: 0.8;">Showing data filtered for App ID ${TARGET_APP_ID}</span>
                ${lastUpdated ? `<br><span style="font-size: 0.7rem; opacity: 0.8;">Updated: ${formatUpdateTime(lastUpdated)}</span>` : ''}
            </div>`;
    }

    function getDateRange(type) {
        const now = new Date();
        let startDate, endDate;

        if (type === 'daily') {
            startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
            endDate = new Date();
        } else if (type === 'weekly') {
            startDate = new Date(
                Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - now.getUTCDay(), 0, 0, 0)
            );
            endDate = new Date();
        } else if (type === 'monthly') {
            startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
            endDate = new Date();
        }

        return {
            date_from: formatDate(startDate),
            date_to: formatDate(endDate),
        };
    }
});
