import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTimer } from '../hooks/useTimer';

const WORK_TIME = 25 * 60; // 25 minutes
const BREAK_TIME = 5 * 60; // 5 minutes
const LONG_BREAK_TIME = 15 * 60; // 15 minutes

export function Pomodoro() {
    const [mode, setMode] = useState('work'); // work, break, longBreak
    const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
    const { seconds, isActive, start, pause, reset } = useTimer(WORK_TIME);

    useEffect(() => {
        if (seconds === 0 && isActive) {
            handleTimerComplete();
        }
    }, [seconds, isActive]);

    const handleTimerComplete = () => {
        if (mode === 'work') {
            const newCount = pomodorosCompleted + 1;
            setPomodorosCompleted(newCount);

            if (newCount % 4 === 0) {
                setMode('longBreak');
                reset(LONG_BREAK_TIME);
            } else {
                setMode('break');
                reset(BREAK_TIME);
            }

            try {
                new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZRQ0PVqzn77BdGAg+ltrzxnMpBSuBzvLZiTYIGmi77uifTRAMUKfj8LZjHAY4ktjyynosBSh+zfHeij0HGGm98OSQRAwKTqXh8bheHAU2jdXyy3krBSh3x/DdkEAKFF606+uoVRQKRp/g8r5sIQUxh9Hz1IIzBh9uwO/jmUUND1as5++wXRgIPpba88Z0KQUsgc7y2Ik2CBlou+7pn00QDFCY5PCzYhwGOJHY8sp5KwUoftHx3oo9Bxhpve/kmEQMCk6l4fG4XhwFNo3V8st5KwUod8fw3ZBABR+v7O2mVBQKRp/g8r5sIQUxh9Hz1IIzBh9uwO/jmUUND1as5++wXRgIPpba88Z0KQUsgc7y2Ik2CBlou+7pn00QDFCY5PCzYhwGOJHY8sp5KwUoftHx3oo9Bxhpve/kmEQMCk6l4fG4XhwFNo3V8st5KwUod8fw3ZBABR+v7O2mVBQKRp/g8r5sIQUxh9Hz1IIzBh9uwO/jmUUND1as5++wXRgIPpba88Z0KQUsgc7y2Ik2CBlou+7pn00QDFCY5PCzYhwGOJHY8sp5KwUoftHx3oo9Bxhpve/kmEQMCk6l4fG4XhwFNo3V8st5KwUod8fw3ZBABR+v7O2mVBQKRp/g8r5sIQUxh9Hz1IIzBh9uwO/jmUUND1as5++wXRgIPpba88Z0KQUsgc7y2Ik2CBlou+7pn00QDFCY5PCzYhwGOJHY8sp5KwUoftHx3oo9Bxhpve/kmEQMCk6l4fG4XhwFNo3V8st5KwUod8fw3ZBABR+v7O2mVBQKRp/g8r5sIQUxh9Hz1IIzBh9uwO/jmUUND1as5++wXRgIPpba88Z0KQUsgc7y2Ik2CBlou+7pn00QDFCY5PCzYhwGOJHY8sp5KwUoftHx3oo9Bxhpve/kmEQMCk6l4fG4XhwFNo3V8st5KwUod8fw3ZBABR+v7O2mVBQKRp/g8r5sIQUxh9Hz1IIzBh9uwO/jmUUND1as5++wXRgIPpba88Z0KQUsgc7y2Ik2CBlou+7pn00QDFCY5PCzYhwGOJHY8sp5KwUoftHx3oo9Bxhpve/kmEQMCk6l4fG4XhwFNo3V8st5KwUod8fw3ZBABR+v7O2mVBQKRp/g8r5sIQUxh9Hz1IIzBh9uwO/jmUUND1as5++wXRgIPpba88Z0KQUsgc7y2Ik2CBlou+7pn00QDFCY5PCzYhwGOJHY8sp5KwUoftHx3oo9Bxhpve/kmEQMCk6l4fG4XhwFNo3V8st5KwUod8fw3ZBABR+v7O2mVBQKRp/g8r5sIQUxh9Hz1IIzBh9uwO/jmUUND1as5++wXRgI=').play();
            } catch (err) { }
        } else {
            setMode('work');
            reset(WORK_TIME);
        }
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
        pause();

        switch (newMode) {
            case 'work':
                reset(WORK_TIME);
                break;
            case 'break':
                reset(BREAK_TIME);
                break;
            case 'longBreak':
                reset(LONG_BREAK_TIME);
                break;
        }
    };

    const formatTimerTime = (secs) => {
        const mins = Math.floor(secs / 60);
        const remainingSecs = secs % 60;
        return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
    };

    const getProgress = () => {
        const total = mode === 'work' ? WORK_TIME : mode === 'break' ? BREAK_TIME : LONG_BREAK_TIME;
        return ((total - seconds) / total) * 100;
    };

    return (
        <div className="space-y-8 w-full">
            <h1 className="text-3xl font-bold text-center md:text-left text-text">Pomodoro Timer</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                {/* Timer Section */}
                <Card elevated className="text-center py-12 flex flex-col items-center h-full">
                    {/* Mode Selector */}
                    <div className="flex gap-2 p-1.5 bg-background/50 rounded-2xl border border-border mb-12 w-full max-w-sm mx-auto">
                        <button
                            onClick={() => handleModeChange('work')}
                            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black tracking-widest transition-all cursor-pointer ${mode === 'work' ? 'bg-primary text-white shadow-lg' : 'text-text-secondary hover:text-text'}`}
                        >
                            FOCUS
                        </button>
                        <button
                            onClick={() => handleModeChange('break')}
                            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black tracking-widest transition-all cursor-pointer ${mode === 'break' ? 'bg-primary text-white shadow-lg' : 'text-text-secondary hover:text-text'}`}
                        >
                            SHORT
                        </button>
                        <button
                            onClick={() => handleModeChange('longBreak')}
                            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black tracking-widest transition-all cursor-pointer ${mode === 'longBreak' ? 'bg-primary text-white shadow-lg' : 'text-text-secondary hover:text-text'}`}
                        >
                            LONG
                        </button>
                    </div>

                    <div className="relative max-w-[360px] w-full aspect-square mx-auto mb-12">
                        {/* Progress Circle Blur */}
                        <div className="absolute inset-0 rounded-full blur-3xl opacity-20 bg-primary animate-pulse" />

                        {/* SVG Progress */}
                        <svg className="w-full h-full relative z-10" viewBox="0 0 200 200">
                            <circle
                                cx="100"
                                cy="100"
                                r="90"
                                fill="none"
                                stroke="var(--color-border)"
                                strokeWidth="8"
                                strokeLinecap="round"
                            />
                            <circle
                                cx="100"
                                cy="100"
                                r="90"
                                fill="none"
                                stroke="var(--color-primary)"
                                strokeWidth="10"
                                strokeDasharray={`${2 * Math.PI * 90}`}
                                strokeDashoffset={`${2 * Math.PI * 90 * (1 - getProgress() / 100)}`}
                                strokeLinecap="round"
                                transform="rotate(-90 100 100)"
                                className="transition-[stroke-dashoffset] duration-300 linear pointer-events-none"
                            />
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                            <div className="text-7xl font-black text-text font-mono tracking-tighter">{formatTimerTime(seconds)}</div>
                            <div className="text-sm font-black uppercase tracking-[0.2em] text-text-secondary mt-2">
                                {mode === 'work' ? 'Working' : 'Resting'}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center w-full max-w-sm px-6">
                        {!isActive ? (
                            <Button size="lg" onClick={start} icon={Play} className="flex-1 shadow-2xl shadow-primary/20 py-5 text-lg font-black uppercase tracking-widest">
                                Start Focus
                            </Button>
                        ) : (
                            <Button size="lg" onClick={pause} icon={Pause} variant="secondary" className="flex-1 py-5 text-lg font-black uppercase tracking-widest">
                                Pause
                            </Button>
                        )}
                        <Button size="lg" variant="ghost" onClick={() => reset(mode === 'work' ? WORK_TIME : mode === 'break' ? BREAK_TIME : LONG_BREAK_TIME)} icon={RotateCcw} className="w-20 h-20 rounded-2xl bg-surface border border-border shadow-sm">
                        </Button>
                    </div>
                </Card>

                {/* Info/Stats Section */}
                <div className="space-y-6">
                    <Card className="p-8">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Brain className="w-5 h-5 text-primary" />
                            Daily Progress
                        </h3>
                        <div className="flex items-end justify-between gap-2 h-32 mb-4">
                            {[2, 5, 3, 8, 4, 6, pomodorosCompleted].map((v, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <div
                                        className={`w-full rounded-t-lg transition-all duration-1000 ${i === 6 ? 'bg-primary' : 'bg-primary/20'}`}
                                        style={{ height: `${Math.max(10, (v / 8) * 100)}%` }}
                                    />
                                    <span className="text-[10px] font-bold text-text-muted">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-sm font-bold text-text-secondary">
                            You've completed <span className="text-primary">{pomodorosCompleted}</span> sessions today
                        </p>
                    </Card>

                    <Card className="p-8 bg-primary/5 border-primary/20">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Coffee className="w-5 h-5 text-primary" />
                            Pro Tip
                        </h3>
                        <p className="text-text-secondary text-sm leading-relaxed">
                            Working in short bursts keeps your brain fresh. Try to get up and stretch during your breaks!
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
