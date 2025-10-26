import React, { lazy, Suspense, useEffect, useState, useCallback } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Blocks, 
    Bot, 
    TrendingUp, 
    Activity, 
    PlayCircle, 
    List, 
    Repeat, 
    Grid3x3,
    SlidersHorizontal,
    ChevronUp,
    ArrowRight
} from 'lucide-react';
import ChunkLoader from '@/components/loader/chunk-loader';
import DesktopWrapper from '@/components/shared_ui/desktop-wrapper';
import Dialog from '@/components/shared_ui/dialog';
import MobileWrapper from '@/components/shared_ui/mobile-wrapper';
import Tabs from '@/components/shared_ui/tabs/tabs';
import TradingViewModal from '@/components/trading-view-chart/trading-view-modal';
import AnalysistoolModal from '@/components/analysistool/analysistool-modal';
import SignalsModal from '@/components/signals/signals-modal';
import AdvancedDisplayModal from '@/components/modals/advanced-display-modal';
import StandaloneChartModal from '@/pages/chart/standalone-chart-modal';
import { DBOT_TABS, TAB_IDS } from '@/constants/bot-contents';
import { api_base, updateWorkspaceName } from '@/external/bot-skeleton';
import { CONNECTION_STATUS } from '@/external/bot-skeleton/services/api/observables/connection-status-stream';
import { isDbotRTL } from '@/external/bot-skeleton/utils/workspace';
import { useApiBase } from '@/hooks/useApiBase';
import { useStore } from '@/hooks/useStore';
import { Localize, localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import RunPanel from '../../components/run-panel';
import ChartModal from '../chart/chart-modal';
import Dashboard from '../dashboard';
import RunStrategy from '../dashboard/run-strategy';
import DisplayToggle from '@/components/trading-hub/display-toggle';
import './main.scss';
import './free-bots.scss';

// Extend Window interface for Blockly
declare global {
    interface Window {
        Blockly: any;
    }
}

const Chart = lazy(() => import('../chart'));

const AppWrapper = observer(() => {
    const { connectionStatus } = useApiBase();
    const { dashboard, load_modal, run_panel, quick_strategy, summary_card } = useStore();
    const { active_tab, is_chart_modal_visible, is_trading_view_modal_visible, setActiveTab } = dashboard;
    const { onEntered } = load_modal;
    const {
        is_dialog_open,
        dialog_options,
        onCancelButtonClick,
        onCloseDialog,
        onOkButtonClick,
        stopBot,
        is_drawer_open,
    } = run_panel;
    const { cancel_button_text, ok_button_text, title, message } = dialog_options as { [key: string]: string };
    const { clear } = summary_card;
    const { DASHBOARD, BOT_BUILDER, AUTO, ANALYSIS_TOOL, SIGNALS, TRADING_HUB } = DBOT_TABS;
    const { isDesktop } = useDevice();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    interface Bot {
        title: string;
        image: string;
        filePath: string;
        xmlContent: string;
        category: string;
        popularity: number;
        description: string;
    }

    const [bots, setBots] = useState<Bot[]>([]);
    const [analysisToolUrl, setAnalysisToolUrl] = useState('ai');
    const [botsCategory, setBotsCategory] = useState('automated');
    const [searchQuery, setSearchQuery] = useState('');
    const [showScrollTop, setShowScrollTop] = useState(false);

    const isAnalysisToolActive = active_tab === ANALYSIS_TOOL;

    useEffect(() => {
        if (connectionStatus !== CONNECTION_STATUS.OPENED) {
            const is_bot_running = document.getElementById('db-animation__stop-button') !== null;
            if (is_bot_running) {
                clear();
                stopBot();
                api_base.setIsRunning(false);
            }
        }
    }, [clear, connectionStatus, stopBot]);

    useEffect(() => {
        const tab_param = searchParams.get('tab');
        if (tab_param !== null) {
            const tab_index = TAB_IDS.findIndex(id => id === tab_param);
            if (tab_index >= 0) {
                handleTabChange(tab_index);
            }
        }

        // Set overunder state to "no" on page load
        localStorage.setItem('is_auto_overunder', 'false');
    }, [searchParams]);

    useEffect(() => {
        const fetchBots = async () => {
            const botFiles = [
                { file: 'Market wizard v1.5.xml', category: 'automated', popularity: 92, description: 'Community favorite with proven track record in various market conditions and excellent risk management.' },
                { file: 'Auto differ recovery over under.xml', category: 'automated', popularity: 90, description: 'Automated difference recovery strategy for over/under markets with adaptive risk management.' },
                { file: 'Tradezilla.xml', category: 'automated', popularity: 88, description: 'Powerful automated trading beast that adapts to market volatility with machine learning algorithms.' },
                { file: 'Envy-differ.xml', category: 'popular', popularity: 85, description: 'Reliable difference-based trading strategy perfect for beginners and steady profit seekers.' },
                { file: 'H_L auto vault.xml', category: 'automated', popularity: 90, description: 'High-Low automated vault system with built-in profit protection and loss prevention mechanisms.' },
                { file: 'Top-notch 2.xml', category: 'automated', popularity: 94, description: 'Top-rated strategy loved by professional traders for its consistency and impressive performance metrics.' },
                { file: 'BOT V3.xml', category: 'popular', popularity: 82, description: 'Stable and dependable trading bot with conservative approach and long-term profitability focus.' },
                { file: 'Even_Odd Killer bot.xml', category: 'popular', popularity: 89, description: 'Highly effective even/odd prediction bot with advanced pattern recognition and statistical analysis.' },
                { file: 'CANDLE MINE v2 BOT.xml', category: 'popular', popularity: 89, description: 'Highly effective even/odd prediction bot with advanced pattern recognition and statistical analysis.' },
            ];
            
            const botPromises = botFiles.map(async ({ file, category, popularity, description }) => {
                try {
                    const response = await fetch(file);
                    if (!response.ok) {
                        return {
                            title: file.split('/').pop(),
                            image: 'default_image_path',
                            filePath: file,
                            xmlContent: `<?xml version="1.0" encoding="UTF-8"?><xml><block type="root">${file}</block></xml>`,
                            category,
                            popularity,
                            description,
                        };
                    }
                    const text = await response.text();
                    const parser = new DOMParser();
                    const xml = parser.parseFromString(text, 'application/xml');
                    return {
                        title: file.split('/').pop(),
                        image: xml.getElementsByTagName('image')[0]?.textContent || 'default_image_path',
                        filePath: file,
                        xmlContent: text,
                        category,
                        popularity,
                        description,
                    };
                } catch (error) {
                    console.error(`Error fetching ${file}:`, error);
                    return {
                        title: file.split('/').pop(),
                        image: 'default_image_path',
                        filePath: file,
                        xmlContent: `<?xml version="1.0" encoding="UTF-8"?><xml><block type="root">${file}</block></xml>`,
                        category,
                        popularity,
                        description,
                    };
                }
            });
            const bots = (await Promise.all(botPromises)).filter(Boolean);
            setBots(bots);
        };

        fetchBots();
    }, []);

    const runBot = (xmlContent: string) => {
        updateWorkspaceName(xmlContent);
    };

    const handleTabChange = useCallback(
        (index: number) => {
            setActiveTab(index);
            setSearchParams({ tab: TAB_IDS[index] });
        },
        [setActiveTab, setSearchParams]
    );

    const handleBotClick = useCallback(
        async (bot: Bot) => {
            setActiveTab(DBOT_TABS.BOT_BUILDER);
            try {
                console.log('Loading bot:', bot.title);

                if (bot.xmlContent) {
                    const tempStrategy = {
                        id: `temp_${Date.now()}`,
                        xml: bot.xmlContent,
                        name: bot.title,
                        save_type: 'local',
                        timestamp: Date.now()
                    };

                    if (load_modal.loadStrategyToBuilder) {
                        console.log('Loading bot using loadStrategyToBuilder...');
                        await load_modal.loadStrategyToBuilder(tempStrategy);
                        console.log('Bot loaded successfully using loadStrategyToBuilder!');
                    } else {
                        console.log('Fallback to direct Blockly loading...');
                        if (window.Blockly?.derivWorkspace) {
                            const workspace = window.Blockly.derivWorkspace;
                            
                            if (workspace.asyncClear) {
                                await workspace.asyncClear();
                            } else {
                                workspace.clear();
                            }
                            
                            const xml = window.Blockly.utils.xml.textToDom(bot.xmlContent);
                            window.Blockly.Xml.domToWorkspace(xml, workspace);
                            
                            workspace.strategy_to_load = bot.xmlContent;
                            
                            console.log('Bot loaded successfully via direct workspace manipulation!');
                        }
                    }
                } else {
                    console.error('No XML content found for bot:', bot.title);
                }
            } catch (error) {
                console.error('Error loading bot:', error);
            }
        },
        [setActiveTab, load_modal]
    );

    const handleOpen = useCallback(async () => {
        await load_modal.loadFileFromRecent();
        setActiveTab(DBOT_TABS.BOT_BUILDER);
    }, [load_modal, setActiveTab]);

    const toggleAnalysisTool = (url: string) => {
        setAnalysisToolUrl(url);
    };

    const showRunPanel = [
        DBOT_TABS.BOT_BUILDER,
        DBOT_TABS.CHART,
        DBOT_TABS.AUTO,
        DBOT_TABS.ANALYSIS_TOOL,
        DBOT_TABS.SIGNALS,
        DBOT_TABS.TRADING_HUB,
        DBOT_TABS.FREE_BOTS,
    ].includes(active_tab);

    useEffect(() => {
        const handleScroll = () => {
            const scrollContainer = document.querySelector('.free-bots-container');
            if (scrollContainer) {
                const scrollTop = scrollContainer.scrollTop;
                setShowScrollTop(scrollTop > 300);
            }
        };

        const scrollContainer = document.querySelector('.free-bots-container');
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
            return () => scrollContainer.removeEventListener('scroll', handleScroll);
        }
    }, [active_tab]);

    const scrollToTop = () => {
        const scrollContainer = document.querySelector('.free-bots-container');
        if (scrollContainer) {
            scrollContainer.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    return (
        <React.Fragment>
            <div className='main'>
                <div className='main__container'>
                    <Tabs
                        active_index={active_tab}
                        className='main__tabs'
                        onTabItemChange={onEntered}
                        onTabItemClick={handleTabChange}
                        top
                    >
                        <div
                            label={
                                <>
                                    <LayoutDashboard size={20} />
                                    <Localize i18n_default_text='Dashboard' />
                                </>
                            }
                            id='id-dbot-dashboard'
                        >
                            <Dashboard handleTabChange={handleTabChange} />
                        </div>
                        <div
                            label={
                                <>
                                    <Blocks size={20} />
                                    <Localize i18n_default_text='Bot Builder' />
                                </>
                            }
                            id='id-bot-builder'
                        />
                        <div
                            label={
                                <>
                                    <TrendingUp size={20} />
                                    <Localize i18n_default_text='Smart trading' />
                                </>
                            }
                            id='id-charts'
                        >
                            <Suspense fallback={<ChunkLoader message={localize('Please wait, loading chart...')} />}>
                                <Chart show_digits_stats={true} />
                            </Suspense>
                        </div>
                        <div
                            label={
                                <>
                                    <Bot size={20} />
                                    <Localize i18n_default_text='Auto Bots' />
                                </>
                            }
                            id='id-auto'
                        >
                            <div
                                className={classNames('dashboard__chart-wrapper', {
                                    'dashboard__chart-wrapper--expanded': is_drawer_open && isDesktop,
                                    'dashboard__chart-wrapper--modal': is_chart_modal_visible && isDesktop,
                                })}
                            >
                                <DisplayToggle />
                            </div>
                        </div>
                        <div
                            label={
                                <>
                                    <SlidersHorizontal size={20} />
                                    <Localize i18n_default_text='Analysis Tool' />
                                </>
                            }
                            id='id-analysis-tool'
                        >
                            <div
                                className={classNames('dashboard__chart-wrapper', {
                                    'dashboard__chart-wrapper--expanded': is_drawer_open && isDesktop,
                                    'dashboard__chart-wrapper--modal': is_chart_modal_visible && isDesktop,
                                })}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '3px',
                                        padding: '8px',
                                        borderBottom: '1px solid var(--border-normal)',
                                    }}
                                >
                                    <button
                                        onClick={() => toggleAnalysisTool('ai')}
                                        style={{
                                            backgroundColor:
                                                analysisToolUrl === 'ai'
                                                    ? 'var(--button-primary-default)'
                                                    : 'transparent',
                                            color: analysisToolUrl === 'ai' ? 'white' : 'var(--text-general)',
                                            padding: '8px 16px',
                                            border: '1px solid var(--border-normal)',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        A Tool
                                    </button>
                                    <button
                                        onClick={() => toggleAnalysisTool('ldpanalyzer')}
                                        style={{
                                            backgroundColor:
                                                analysisToolUrl === 'ldpanalyzer'
                                                    ? 'var(--button-primary-default)'
                                                    : 'transparent',
                                            color: analysisToolUrl === 'ldpanalyzer' ? 'white' : 'var(--text-general)',
                                            padding: '8px 16px',
                                            border: '1px solid var(--border-normal)',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        LDP Tool
                                    </button>
                                    <button
                                        onClick={() => toggleAnalysisTool('arbitrage')}
                                        style={{
                                            backgroundColor:
                                                analysisToolUrl === 'arbitrage'
                                                    ? 'var(--button-primary-default)'
                                                    : 'transparent',
                                            color: analysisToolUrl === 'arbitrage' ? 'white' : 'var(--text-general)',
                                            padding: '8px 16px',
                                            border: '1px solid var(--border-normal)',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Arbitrage
                                    </button>
                                </div>
                                <iframe
                                    src={analysisToolUrl}
                                    width='100%'
                                    height='600px'
                                    style={{ border: 'none', display: 'block' }}
                                    scrolling='yes'
                                />
                            </div>
                        </div>
                        <div
                            label={
                                <>
                                    <List size={20} />
                                    <Localize i18n_default_text='Signals' />
                                </>
                            }
                            id='id-signals'
                        >
                            <div
                                className={classNames('dashboard__chart-wrapper', {
                                    'dashboard__chart-wrapper--expanded': is_drawer_open && isDesktop,
                                    'dashboard__chart-wrapper--modal': is_chart_modal_visible && isDesktop,
                                })}
                            >
                                <iframe
                                    src='signals'
                                    width='100%'
                                    height='600px'
                                    style={{ border: 'none', display: 'block' }}
                                    scrolling='yes'
                                />
                            </div>
                        </div>
                        <div
                            label={
                                <>
                                    <Repeat size={20} />
                                    <Localize i18n_default_text='Trading Hub' />
                                </>
                            }
                            id='id-Trading-Hub'
                        >
                            <div
                                className={classNames('dashboard__chart-wrapper', {
                                    'dashboard__chart-wrapper--expanded': is_drawer_open && isDesktop,
                                    'dashboard__chart-wrapper--modal': is_chart_modal_visible && isDesktop,
                                })}
                            >
                                <iframe
                                    src='https://app.binaryfx.site/acc-center'
                                    width='98%'
                                    height='600px'
                                    style={{ border: 'none', display: 'block' }}
                                    scrolling='yes'
                                />
                            </div>
                        </div>
                        <div
                            label={
                                <>
                                    <Bot size={20} color="#ff7a00" />
                                    <Localize i18n_default_text='Premuim Bots' />
                                </>
                            }
                            id='id-free-bots'
                        >
                            <div className='free-bots-container'>
                                <div className='container-content'>
                                    <div className='free-bots-header'>
                                        <h1 className='free-bots-header__title'>
                                            <Localize i18n_default_text='Premium Trading Bots' />
                                        </h1>
                                        <p className='free-bots-header__subtitle'>
                                            <Localize i18n_default_text='Discover our collection of professionally designed trading bots. Choose from automated strategies, popular community favorites, or reliable everyday trading solutions.' />
                                        </p>
                                        
                                        <div className='free-bots-stats'>
                                            <div className='free-bots-stats__item'>
                                                <div className='free-bots-stats__number'>{bots.length}</div>
                                                <div className='free-bots-stats__label'>
                                                    <Localize i18n_default_text='Available Bots' />
                                                </div>
                                            </div>
                                            <div className='free-bots-stats__item'>
                                                <div className='free-bots-stats__number'>95%</div>
                                                <div className='free-bots-stats__label'>
                                                    <Localize i18n_default_text='Success Rate' />
                                                </div>
                                            </div>
                                            <div className='free-bots-stats__item'>
                                                <div className='free-bots-stats__number'>24/7</div>
                                                <div className='free-bots-stats__label'>
                                                    <Localize i18n_default_text='Trading' />
                                                </div>
                                            </div>
                                            <div className='free-bots-stats__item'>
                                                <div className='free-bots-stats__number'>
                                                    {bots.filter(bot => bot.category === botsCategory).length}
                                                </div>
                                                <div className='free-bots-stats__label'>
                                                    {botsCategory === 'automated' && <Localize i18n_default_text='Auto Bots' />}
                                                    {botsCategory === 'popular' && <Localize i18n_default_text='Popular' />}
                                                    {botsCategory === 'regular' && <Localize i18n_default_text='Regular' />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='free-bots-search'>
                                        <input
                                            type='text'
                                            className='free-bots-search__input'
                                            placeholder='Search bots by name or description...'
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>

                                    <div className='free-bots-filters'>
                                        {[
                                            { key: 'automated', label: 'Automated Strategies', icon: '🤖' },
                                            { key: 'popular', label: 'Community Favorites', icon: '⭐' },
                                            { key: 'regular', label: 'Reliable Classics', icon: '📊' }
                                        ].map(category => (
                                            <button
                                                key={category.key}
                                                onClick={() => setBotsCategory(category.key)}
                                                className={`free-bots-filters__button ${
                                                    botsCategory === category.key ? 'free-bots-filters__button--active' : ''
                                                }`}
                                            >
                                                <span style={{ marginRight: '8px' }}>{category.icon}</span>
                                                <Localize i18n_default_text={category.label} />
                                            </button>
                                        ))}
                                    </div>

                                    {bots.length === 0 ? (
                                        <div className='loading-skeleton'>
                                            <div className='free-bots-grid'>
                                                {Array.from({ length: 6 }).map((_, index) => (
                                                    <div key={index} className='bot-card'>
                                                        <div className='bot-card__header'>
                                                            <div className='bot-card__icon'>
                                                                <Bot size={24} />
                                                            </div>
                                                            <div>
                                                                <h3 className='bot-card__title'>Loading...</h3>
                                                            </div>
                                                        </div>
                                                        <div className='bot-card__content'>
                                                            <p className='bot-card__description'>Loading bot details...</p>
                                                            <div className='bot-card__features'>
                                                                <span className='bot-card__feature'>Loading</span>
                                                            </div>
                                                            <button className='bot-card__action'>
                                                                <Localize i18n_default_text='Load Bot' />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='free-bots-grid'>
                                            {bots
                                                .filter(bot => bot.category === botsCategory)
                                                .filter(bot => 
                                                    searchQuery === '' || 
                                                    bot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                    bot.description.toLowerCase().includes(searchQuery.toLowerCase())
                                                )
                                                .map((bot, index) => (
                                                    <div
                                                        key={index}
                                                        className='bot-card'
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            handleBotClick(bot);
                                                        }}
                                                    >
                                                        <div className='bot-card__header'>
                                                            <div className='bot-card__icon'>
                                                                <Bot size={24} />
                                                            </div>
                                                            <div style={{ flex: 1 }}>
                                                                <h3 className='bot-card__title'>
                                                                    {bot.title.replace('.xml', '').replace(/[-_]/g, ' ')}
                                                                </h3>
                                                                {bot.popularity && (
                                                                    <div style={{ 
                                                                        display: 'flex', 
                                                                        alignItems: 'center', 
                                                                        gap: '4px', 
                                                                        marginTop: '4px'
                                                                    }}>
                                                                        <span style={{ 
                                                                            fontSize: '0.75rem', 
                                                                            color: 'var(--text-general)'
                                                                        }}>
                                                                            Rating:
                                                                        </span>
                                                                        <div style={{ 
                                                                            display: 'flex', 
                                                                            alignItems: 'center',
                                                                            gap: '2px'
                                                                        }}>
                                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                                <span 
                                                                                    key={i}
                                                                                    style={{ 
                                                                                        fontSize: '0.75rem',
                                                                                        color: i < Math.floor(bot.popularity / 20) 
                                                                                            ? '#FFD700' 
                                                                                            : 'var(--border-normal)'
                                                                                    }}
                                                                                >
                                                                                    ⭐
                                                                                </span>
                                                                            ))}
                                                                            <span style={{ 
                                                                                fontSize: '0.7rem', 
                                                                                color: 'var(--text-general)',
                                                                                marginLeft: '4px'
                                                                            }}>
                                                                                ({bot.popularity}%)
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className='bot-card__content'>
                                                            <p className='bot-card__description'>
                                                                {bot.description || (
                                                                    <>
                                                                        {botsCategory === 'automated' && (
                                                                            <Localize i18n_default_text='Advanced automated trading strategy with intelligent market analysis and risk management.' />
                                                                        )}
                                                                        {botsCategory === 'popular' && (
                                                                            <Localize i18n_default_text='Highly rated bot trusted by thousands of traders worldwide for consistent performance.' />
                                                                        )}
                                                                        {botsCategory === 'regular' && (
                                                                            <Localize i18n_default_text='Stable and reliable trading bot perfect for long-term trading strategies.' />
                                                                        )}
                                                                    </>
                                                                )}
                                                            </p>
                                                            <div className='bot-card__features'>
                                                                {botsCategory === 'automated' && (
                                                                    <>
                                                                        <span className='bot-card__feature'>Auto-Execute</span>
                                                                        <span className='bot-card__feature'>Risk Control</span>
                                                                        <span className='bot-card__feature'>24/7 Trading</span>
                                                                    </>
                                                                )}
                                                                {botsCategory === 'popular' && (
                                                                    <>
                                                                        <span className='bot-card__feature'>Community Tested</span>
                                                                        <span className='bot-card__feature'>High Performance</span>
                                                                        <span className='bot-card__feature'>User Favorite</span>
                                                                    </>
                                                                )}
                                                                {botsCategory === 'regular' && (
                                                                    <>
                                                                        <span className='bot-card__feature'>Stable</span>
                                                                        <span className='bot-card__feature'>Low Risk</span>
                                                                        <span className='bot-card__feature'>Beginner Friendly</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <button
                                                                className='bot-card__action'
                                                                onClick={e => {
                                                                    e.stopPropagation();
                                                                    handleBotClick(bot);
                                                                }}
                                                            >
                                                                <Localize i18n_default_text='Load Bot' />
                                                                <ArrowRight size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    )}

                                    {bots.length > 0 && bots
                                        .filter(bot => bot.category === botsCategory)
                                        .filter(bot => 
                                            searchQuery === '' || 
                                            bot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            bot.description.toLowerCase().includes(searchQuery.toLowerCase())
                                        ).length === 0 && (
                                        <div className='free-bots-empty'>
                                            <div className='free-bots-empty__icon'>
                                                <Bot size={48} />
                                            </div>
                                            <h3 className='free-bots-empty__title'>
                                                {searchQuery ? (
                                                    <Localize i18n_default_text='No bots found' />
                                                ) : (
                                                    <Localize i18n_default_text='No bots available' />
                                                )}
                                            </h3>
                                            <p className='free-bots-empty__description'>
                                                {searchQuery ? (
                                                    <Localize i18n_default_text='No bots match your search criteria. Try adjusting your search terms.' />
                                                ) : (
                                                    <Localize i18n_default_text='There are no bots available in this category at the moment. Please try another category.' />
                                                )}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                
                                {showScrollTop && (
                                    <button
                                        className={`scroll-to-top ${showScrollTop ? 'scroll-to-top--visible' : ''}`}
                                        onClick={scrollToTop}
                                        aria-label="Scroll to top"
                                    >
                                        <ChevronUp size={24} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </Tabs>
                </div>
            </div>
            <DesktopWrapper>
                <div className='main__run-strategy-wrapper'>
                    <RunStrategy />
                    {showRunPanel && <RunPanel />}
                </div>
                <ChartModal />
                <TradingViewModal />
                <AnalysistoolModal />
                <SignalsModal />
                <AdvancedDisplayModal />
                <StandaloneChartModal />
            </DesktopWrapper>
            <MobileWrapper>
                <RunPanel />
            </MobileWrapper>
            <Dialog
                cancel_button_text={cancel_button_text || localize('Cancel')}
                confirm_button_text={ok_button_text || localize('Ok')}
                has_close_icon
                is_visible={is_dialog_open}
                onCancel={onCancelButtonClick}
                onClose={onCloseDialog}
                onConfirm={onOkButtonClick || onCloseDialog}
                title={title}
            >
                {message}
            </Dialog>
        </React.Fragment>
    );
});

export default AppWrapper;