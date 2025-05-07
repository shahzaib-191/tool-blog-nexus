
import { useState, useEffect, useRef } from 'react';
import ToolHeader from './ToolHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Play, Pause, SkipForward, Settings, Volume2, Bell } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PomodoroTimerTool = () => {
  // Timer settings
  const [pomodoroTime, setPomodoroTime] = useState<number>(25);
  const [shortBreakTime, setShortBreakTime] = useState<number>(5);
  const [longBreakTime, setLongBreakTime] = useState<number>(15);
  const [sessions, setSessions] = useState<number>(4);
  
  // Timer state
  const [mode, setMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');
  const [secondsLeft, setSecondsLeft] = useState<number>(pomodoroTime * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentSession, setCurrentSession] = useState<number>(1);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [autoStartBreaks, setAutoStartBreaks] = useState<boolean>(true);
  const [autoStartPomodoros, setAutoStartPomodoros] = useState<boolean>(false);
  const [volume, setVolume] = useState<number[]>([80]);
  
  // Toast notification
  const { toast } = useToast();
  
  // Refs
  const timerInterval = useRef<number | null>(null);
  const alarmSound = useRef<HTMLAudioElement | null>(null);

  // Set timer for the current mode
  useEffect(() => {
    let time = 0;
    switch(mode) {
      case 'pomodoro':
        time = pomodoroTime * 60;
        break;
      case 'shortBreak':
        time = shortBreakTime * 60;
        break;
      case 'longBreak':
        time = longBreakTime * 60;
        break;
    }
    setSecondsLeft(time);
  }, [mode, pomodoroTime, shortBreakTime, longBreakTime]);

  // Initialize alarm sound
  useEffect(() => {
    alarmSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, []);

  // Set volume for alarm
  useEffect(() => {
    if (alarmSound.current) {
      alarmSound.current.volume = volume[0] / 100;
    }
  }, [volume]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start or pause timer
  const toggleTimer = (): void => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  // Start timer
  const startTimer = (): void => {
    setIsRunning(true);
    
    timerInterval.current = window.setInterval(() => {
      setSecondsLeft((prevSeconds) => {
        if (prevSeconds <= 1) {
          handleTimerComplete();
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);
  };

  // Pause timer
  const pauseTimer = (): void => {
    setIsRunning(false);
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
  };

  // Reset the current timer
  const resetTimer = (): void => {
    pauseTimer();
    
    let time = 0;
    switch(mode) {
      case 'pomodoro':
        time = pomodoroTime * 60;
        break;
      case 'shortBreak':
        time = shortBreakTime * 60;
        break;
      case 'longBreak':
        time = longBreakTime * 60;
        break;
    }
    
    setSecondsLeft(time);
  };

  // Handle timer completion
  const handleTimerComplete = (): void => {
    pauseTimer();
    
    // Play sound
    if (alarmSound.current) {
      alarmSound.current.play().catch(error => console.error("Error playing sound:", error));
    }
    
    // Show notification based on current mode
    let title = '';
    let description = '';
    let nextMode: 'pomodoro' | 'shortBreak' | 'longBreak' = 'pomodoro';
    
    if (mode === 'pomodoro') {
      title = 'Pomodoro completed!';
      description = 'Time for a break.';
      
      // Determine which break type to take
      if (currentSession % sessions === 0) {
        nextMode = 'longBreak';
        description = 'Time for a long break!';
      } else {
        nextMode = 'shortBreak';
        description = 'Time for a short break!';
      }
      
      // Increment session if we completed a pomodoro
      setCurrentSession(prev => prev + 1);
    } else if (mode === 'shortBreak') {
      title = 'Break completed!';
      description = 'Ready to focus again?';
      nextMode = 'pomodoro';
    } else { // longBreak
      title = 'Long break completed!';
      description = 'Ready for the next round?';
      nextMode = 'pomodoro';
    }
    
    toast({
      title,
      description,
    });
    
    // Auto start next timer if setting is enabled
    setMode(nextMode);
    
    if ((nextMode === 'pomodoro' && autoStartPomodoros) || 
        ((nextMode === 'shortBreak' || nextMode === 'longBreak') && autoStartBreaks)) {
      // Small delay to ensure the new timer is set before starting
      setTimeout(() => {
        startTimer();
      }, 500);
    }
  };

  // Skip to the next timer
  const skipToNext = (): void => {
    pauseTimer();
    
    // Determine which timer should be next
    let nextMode: 'pomodoro' | 'shortBreak' | 'longBreak';
    if (mode === 'pomodoro') {
      if (currentSession % sessions === 0) {
        nextMode = 'longBreak';
      } else {
        nextMode = 'shortBreak';
      }
      setCurrentSession(prev => prev + 1);
    } else {
      nextMode = 'pomodoro';
    }
    
    setMode(nextMode);
  };

  // Calculate progress percentage
  const calculateProgress = (): number => {
    let totalSeconds = 0;
    switch(mode) {
      case 'pomodoro':
        totalSeconds = pomodoroTime * 60;
        break;
      case 'shortBreak':
        totalSeconds = shortBreakTime * 60;
        break;
      case 'longBreak':
        totalSeconds = longBreakTime * 60;
        break;
    }
    
    return ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  };

  // Update document title with timer
  useEffect(() => {
    let modeText = '';
    switch(mode) {
      case 'pomodoro':
        modeText = '🍅 Focus';
        break;
      case 'shortBreak':
        modeText = '☕ Short Break';
        break;
      case 'longBreak':
        modeText = '🌴 Long Break';
        break;
    }
    
    document.title = `${formatTime(secondsLeft)} - ${modeText}`;
    
    return () => {
      document.title = 'Pomodoro Timer';
    };
  }, [secondsLeft, mode]);

  // Apply settings
  const applySettings = () => {
    resetTimer(); // Reset with new times
    setShowSettings(false);
    toast({
      title: "Settings saved",
      description: "Your timer settings have been updated.",
    });
  };

  return (
    <>
      <ToolHeader
        title="Pomodoro Timer"
        description="Enhance productivity using the Pomodoro technique with customizable work and break intervals."
      />
      
      <div className="container mx-auto px-4 py-6">
        <Card className="max-w-md mx-auto p-6">
          {/* Timer Display */}
          <div className="mb-6 text-center">
            <div className="relative">
              <div 
                className="w-48 h-48 rounded-full border-8 border-gray-200 mx-auto flex items-center justify-center"
                style={{
                  background: `conic-gradient(
                    ${mode === 'pomodoro' ? '#ef4444' : mode === 'shortBreak' ? '#3b82f6' : '#8b5cf6'} ${calculateProgress()}%, 
                    transparent ${calculateProgress()}%
                  )`
                }}
              >
                <div className="w-36 h-36 rounded-full bg-white flex items-center justify-center">
                  <div>
                    <div className="text-4xl font-bold">{formatTime(secondsLeft)}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {mode === 'pomodoro' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <div className="text-sm text-gray-500">
                  Session {currentSession} / {sessions}
                </div>
              </div>
            </div>
          </div>
          
          {/* Mode Tabs */}
          <Tabs value={mode} onValueChange={(value) => setMode(value as any)} className="mb-6">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="pomodoro" className="text-red-500">Focus</TabsTrigger>
              <TabsTrigger value="shortBreak" className="text-blue-500">Short Break</TabsTrigger>
              <TabsTrigger value="longBreak" className="text-purple-500">Long Break</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Controls */}
          <div className="flex justify-center space-x-4 mb-6">
            <Button 
              onClick={toggleTimer} 
              size="lg"
              className={`rounded-full w-16 h-16 ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {isRunning ? <Pause size={24} /> : <Play size={24} />}
            </Button>
            
            <Button 
              onClick={skipToNext} 
              size="icon" 
              variant="outline" 
              className="rounded-full w-16 h-16"
            >
              <SkipForward size={24} />
            </Button>
            
            <Button 
              onClick={() => setShowSettings(!showSettings)} 
              size="icon" 
              variant="outline" 
              className="rounded-full w-16 h-16"
            >
              <Settings size={24} />
            </Button>
          </div>
          
          {/* Settings Panel */}
          {showSettings && (
            <div className="border-t border-gray-200 pt-4 space-y-4">
              <h3 className="font-medium text-lg mb-4">Timer Settings</h3>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pomodoroTime">Focus Time (minutes)</Label>
                      <Input
                        id="pomodoroTime"
                        type="number"
                        min="1"
                        max="60"
                        value={pomodoroTime}
                        onChange={(e) => setPomodoroTime(parseInt(e.target.value) || 25)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sessions">Sessions before long break</Label>
                      <Input
                        id="sessions"
                        type="number"
                        min="1"
                        max="10"
                        value={sessions}
                        onChange={(e) => setSessions(parseInt(e.target.value) || 4)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shortBreakTime">Short Break (minutes)</Label>
                      <Input
                        id="shortBreakTime"
                        type="number"
                        min="1"
                        max="30"
                        value={shortBreakTime}
                        onChange={(e) => setShortBreakTime(parseInt(e.target.value) || 5)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="longBreakTime">Long Break (minutes)</Label>
                      <Input
                        id="longBreakTime"
                        type="number"
                        min="1"
                        max="60"
                        value={longBreakTime}
                        onChange={(e) => setLongBreakTime(parseInt(e.target.value) || 15)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Auto Start Timers</h4>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoStartBreaks" className="cursor-pointer">Auto start breaks</Label>
                    <Switch 
                      id="autoStartBreaks"
                      checked={autoStartBreaks}
                      onCheckedChange={setAutoStartBreaks}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoStartPomodoros" className="cursor-pointer">Auto start focus sessions</Label>
                    <Switch 
                      id="autoStartPomodoros"
                      checked={autoStartPomodoros}
                      onCheckedChange={setAutoStartPomodoros}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Volume2 size={18} />
                      <Label>Alarm Volume</Label>
                    </div>
                    <span>{volume[0]}%</span>
                  </div>
                  <Slider
                    value={volume}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={setVolume}
                  />
                  <div className="flex justify-center mt-2">
                    <Button size="sm" variant="outline" onClick={() => alarmSound.current?.play()}>
                      <Bell size={16} className="mr-2" /> Test Sound
                    </Button>
                  </div>
                </div>
                
                <div className="pt-2 flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowSettings(false)}>
                    Cancel
                  </Button>
                  <Button onClick={applySettings}>
                    Save Settings
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Tips */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="font-medium mb-2">Pomodoro Technique Tips</h3>
            <ul className="text-sm space-y-1 text-gray-600 list-disc list-inside">
              <li>Focus completely on one task during each Pomodoro</li>
              <li>Take a short break between each Pomodoro</li>
              <li>Take a longer break after 4 Pomodoros</li>
              <li>If you finish early, review your work until the timer rings</li>
              <li>If you get distracted, note it down and return to your task</li>
            </ul>
          </div>
        </Card>
      </div>
    </>
  );
};

export default PomodoroTimerTool;
