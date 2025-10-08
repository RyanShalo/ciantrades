//kept sometihings commented beacuse of mobx to integrate popup functionality here
import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import Text from '@/components/shared_ui/text';
import { DBOT_TABS } from '@/constants/bot-contents';
import { useStore } from '@/hooks/useStore';
import {
    DerivLightBotBuilderIcon,
    DerivLightLocalDeviceIcon,
    DerivLightMyComputerIcon,
    DerivLightQuickStrategyIcon,
} from '@deriv/quill-icons/Illustration';
import { Localize } from '@deriv-com/translations';
import { rudderStackSendOpenEvent } from '../../analytics/rudderstack-common-events';
import { rudderStackSendDashboardClickEvent } from '../../analytics/rudderstack-dashboard';
import DashboardBotList from './bot-list/dashboard-bot-list';

// Custom icons for new buttons
const FreeBotsIcon = ({ height = '48px', width = '48px' }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C13.1046 2 14 2.89543 14 4V6H18C19.1046 6 20 6.89543 20 8V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V8C4 6.89543 4.89543 6 6 6H10V4C10 2.89543 10.8954 2 12 2Z" fill="var(--text-general)" />
        <circle cx="12" cy="10" r="1.5" fill="var(--general-main-1)" />
        <path d="M8 14H16" stroke="var(--general-main-1)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 16H14" stroke="var(--general-main-1)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const SignalsIcon = ({ height = '48px', width = '48px' }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 12L8 7L13 12L21 4" stroke="var(--text-general)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 4H21V7" stroke="var(--text-general)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8" cy="7" r="2" fill="var(--text-general)" />
        <circle cx="13" cy="12" r="2" fill="var(--text-general)" />
        <circle cx="21" cy="4" r="2" fill="var(--text-general)" />
        <circle cx="3" cy="12" r="2" fill="var(--text-general)" />
    </svg>
);

const AnalysisToolIcon = ({ height = '48px', width = '48px' }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="var(--text-general)" strokeWidth="2" fill="none" />
        <path d="M7 8V16" stroke="var(--text-general)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M12 6V16" stroke="var(--text-general)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M17 10V16" stroke="var(--text-general)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="7" cy="8" r="1.5" fill="var(--text-general)" />
        <circle cx="12" cy="6" r="1.5" fill="var(--text-general)" />
        <circle cx="17" cy="10" r="1.5" fill="var(--text-general)" />
    </svg>
);

type TCardProps = {
    has_dashboard_strategies: boolean;
    is_mobile: boolean;
};

type TCardArray = {
    id: string;
    icon: React.ReactElement;
    content: React.ReactElement;
    callback: () => void;
};

const Cards = observer(({ is_mobile, has_dashboard_strategies }: TCardProps) => {
    const { dashboard, load_modal, quick_strategy } = useStore();
    const { toggleLoadModal, setActiveTabIndex } = load_modal;
    const { setActiveTab } = dashboard;
    const { setFormVisibility } = quick_strategy;

    const openFileLoader = () => {
        toggleLoadModal();
        setActiveTabIndex(is_mobile ? 0 : 1);
        setActiveTab(DBOT_TABS.BOT_BUILDER);
    };

    const actions: TCardArray[] = [
        {
            id: 'my-computer',
            icon: is_mobile ? (
                <DerivLightLocalDeviceIcon height='32px' width='32px' />
            ) : (
                <DerivLightMyComputerIcon height='48px' width='48px' />
            ),
            content: is_mobile ? <Localize i18n_default_text='Local' /> : <Localize i18n_default_text='My computer' />,
            callback: () => {
                openFileLoader();
                rudderStackSendOpenEvent({
                    subpage_name: 'bot_builder',
                    subform_source: 'dashboard',
                    subform_name: 'quick_strategy',
                });
            },
        },
        {
            id: 'free-bots',
            icon: <FreeBotsIcon height={is_mobile ? '32px' : '48px'} width={is_mobile ? '32px' : '48px'} />,
            content: <Localize i18n_default_text='Free bots' />,
            callback: () => {
                setActiveTab(DBOT_TABS.FREE_BOTS);
                rudderStackSendDashboardClickEvent({});
            },
        },
        {
            id: 'signals',
            icon: <SignalsIcon height={is_mobile ? '32px' : '48px'} width={is_mobile ? '32px' : '48px'} />,
            content: <Localize i18n_default_text='Signals' />,
            callback: () => {
                setActiveTab(DBOT_TABS.SIGNALS);
                rudderStackSendDashboardClickEvent({});
            },
        },
        {
            id: 'analysis-tool',
            icon: <AnalysisToolIcon height={is_mobile ? '32px' : '48px'} width={is_mobile ? '32px' : '48px'} />,
            content: <Localize i18n_default_text='Analysis tool' />,
            callback: () => {
                setActiveTab(DBOT_TABS.ANALYSIS_TOOL);
                rudderStackSendDashboardClickEvent({});
            },
        },
        {
            id: 'bot-builder',
            icon: <DerivLightBotBuilderIcon height={is_mobile ? '32px' : '48px'} width={is_mobile ? '32px' : '48px'} />,
            content: <Localize i18n_default_text='Bot builder' />,
            callback: () => {
                setActiveTab(DBOT_TABS.BOT_BUILDER);
                rudderStackSendDashboardClickEvent({});
            },
        },
        {
            id: 'quick-strategy',
            icon: <DerivLightQuickStrategyIcon height={is_mobile ? '32px' : '48px'} width={is_mobile ? '32px' : '48px'} />,
            content: <Localize i18n_default_text='Quick strategy' />,
            callback: () => {
                setActiveTab(DBOT_TABS.BOT_BUILDER);
                setFormVisibility(true);
                rudderStackSendOpenEvent({
                    subpage_name: 'bot_builder',
                    subform_source: 'dashboard',
                    subform_name: 'quick_strategy',
                });
            },
        },
    ];

    return React.useMemo(
        () => (
            <div
                className={classNames('tab__dashboard__table', {
                    'tab__dashboard__table--minimized': has_dashboard_strategies && is_mobile,
                })}
            >
                <div
                    className={classNames('tab__dashboard__table__tiles', {
                        'tab__dashboard__table__tiles--minimized': has_dashboard_strategies && is_mobile,
                    })}
                    id='tab__dashboard__table__tiles'
                >
                    {actions.map(icons => {
                        const { icon, content, callback, id } = icons;
                        return (
                            <div
                                key={id}
                                className={classNames('tab__dashboard__table__block', {
                                    'tab__dashboard__table__block--minimized': has_dashboard_strategies && is_mobile,
                                })}
                            >
                                <div
                                    className={classNames('tab__dashboard__table__images', {
                                        'tab__dashboard__table__images--minimized': has_dashboard_strategies,
                                    })}
                                    id={id}
                                    onClick={() => {
                                        callback();
                                    }}
                                >
                                    {icon}
                                </div>
                                <Text color='prominent' size={is_mobile ? 'xxs' : 'xs'}>
                                    {content}
                                </Text>
                            </div>
                        );
                    })}
                </div>
                <DashboardBotList />
            </div>
        ),
        [has_dashboard_strategies]
    );
});

export default Cards;
