import { useState } from "react";

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordFocusTime, setPasswordFocusTime] = useState(null);
  const [typingStartTime, setTypingStartTime] = useState(null);
  const [typingEndTime, setTypingEndTime] = useState(null);
  const [backspaceCount, setBackspaceCount] = useState(0);
  const [keyPressTimestamps, setKeyPressTimestamps] = useState([]);

  function handlePasswordFocus() {
    if (passwordFocusTime === null) {
      setPasswordFocusTime(Date.now());
    }
  }

  function handleKeyDown(event) {
    const currentTime = Date.now();

    if (typingStartTime === null) {
      setTypingStartTime(currentTime);
    }

    setKeyPressTimestamps((previousTimestamps) => [
      ...previousTimestamps,
      currentTime,
    ]);

    if (event.key === "Backspace") {
      setBackspaceCount((previousCount) => previousCount + 1);
    }
  }

  function handleKeyUp() {
    setTypingEndTime(Date.now());
  }

  function handlePasswordClipboard(event) {
    event.preventDefault();
    console.warn("Clipboard actions disabled for behavioral authentication");
  }

  function calculateTotalTypingTime() {
    if (typingStartTime === null || typingEndTime === null) {
      return 0;
    }

    return typingEndTime - typingStartTime;
  }

  function calculateAverageKeyLatency() {
    if (keyPressTimestamps.length < 2) {
      return 0;
    }

    let totalLatency = 0;

    for (let index = 1; index < keyPressTimestamps.length; index += 1) {
      totalLatency += keyPressTimestamps[index] - keyPressTimestamps[index - 1];
    }

    return totalLatency / (keyPressTimestamps.length - 1);
  }

  function calculateHesitationTime() {
    if (passwordFocusTime === null || typingStartTime === null) {
      return 0;
    }

    return typingStartTime - passwordFocusTime;
  }

  function createBehavioralData() {
    const totalTypingTime = calculateTotalTypingTime();
    const averageKeyLatency = calculateAverageKeyLatency();
    const hesitationTime = calculateHesitationTime();

    return {
      keyboardMetrics: {
        username,
        totalTypingTime,
        averageKeyLatency,
        backspaceCount,
        keyPressCount: keyPressTimestamps.length,
        hesitationTime,
      },
      sessionMetrics: {
        loginTimestamp: Date.now(),
        failedLoginAttempts: 0,
      },
      rawTiming: {
        typingStartTime,
        typingEndTime,
        keyPressTimestamps,
      },
    };
  }

  function getStoredBehavioralProfile(profileKey) {
    const storedProfile = localStorage.getItem(profileKey);

    if (!storedProfile) {
      return null;
    }

    return JSON.parse(storedProfile);
  }

  function calculateDeviationValue(previousValue, currentValue) {
    return Math.abs(currentValue - previousValue);
  }

  function createDeviationAnalysis(previousProfile, currentProfile) {
    return {
      totalTypingTime: calculateDeviationValue(
        previousProfile.keyboardMetrics.totalTypingTime,
        currentProfile.keyboardMetrics.totalTypingTime
      ),
      averageKeyLatency: calculateDeviationValue(
        previousProfile.keyboardMetrics.averageKeyLatency,
        currentProfile.keyboardMetrics.averageKeyLatency
      ),
      backspaceCount: calculateDeviationValue(
        previousProfile.keyboardMetrics.backspaceCount,
        currentProfile.keyboardMetrics.backspaceCount
      ),
      hesitationTime: calculateDeviationValue(
        previousProfile.keyboardMetrics.hesitationTime,
        currentProfile.keyboardMetrics.hesitationTime
      ),
    };
  }

  function getDeviationLevel(metricName, deviationValue) {
    const thresholds = {
      totalTypingTime: { small: 500, moderate: 1500 },
      averageKeyLatency: { small: 50, moderate: 150 },
      backspaceCount: { small: 1, moderate: 3 },
      hesitationTime: { small: 300, moderate: 1000 },
    };

    const metricThresholds = thresholds[metricName];

    if (deviationValue <= metricThresholds.small) {
      return { level: "small", penalty: 0, note: null };
    }

    if (deviationValue <= metricThresholds.moderate) {
      return {
        level: "moderate",
        penalty: 15,
        note: `+ moderate ${metricName} deviation`,
      };
    }

    return {
      level: "large",
      penalty: 30,
      note: `+ high ${metricName} deviation`,
    };
  }

  function generateTrustEngine(deviationAnalysis) {
    const deviationEntries = Object.entries(deviationAnalysis);
    let totalPenalty = 0;
    const explanationParts = [];

    deviationEntries.forEach(([metricName, deviationValue]) => {
      const deviationInfo = getDeviationLevel(metricName, deviationValue);
      totalPenalty += deviationInfo.penalty;

      if (deviationInfo.note) {
        explanationParts.push(deviationInfo.note);
      }
    });

    const trustScore = Math.max(0, 100 - totalPenalty);

    let riskLevel = "LOW";

    if (trustScore < 50) {
      riskLevel = "HIGH";
    } else if (trustScore < 80) {
      riskLevel = "MEDIUM";
    }

    const explanation =
      explanationParts.length > 0
        ? explanationParts.join(" ")
        : "+ small deviations across typing metrics";

    return {
      trustScore,
      riskLevel,
      explanation,
    };
  }

  function handleLogin(event) {
    event.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      return;
    }

    const behavioralData = createBehavioralData();
    const currentProfile = behavioralData;
    const previousProfile = getStoredBehavioralProfile(trimmedUsername);
    let trustEngineResult = {
      trustScore: 100,
      riskLevel: "LOW",
      explanation: "+ new Behavioral Digital Twin profile created",
    };

    if (previousProfile) {
      const deviationAnalysis = createDeviationAnalysis(previousProfile, currentProfile);
      trustEngineResult = generateTrustEngine(deviationAnalysis);

      console.log("Previous Behavioral Profile:", previousProfile);
      console.log("Current Behavioral Profile:", currentProfile);
      console.log("Behavioral Deviation Analysis:", deviationAnalysis);
      console.log("Trust Score:", trustEngineResult.trustScore);
      console.log("Risk Level:", trustEngineResult.riskLevel);
      console.log("Trust Explanation:", trustEngineResult.explanation);
    } else {
      console.log("No previous profile found. Creating new Behavioral Digital Twin profile.");
      console.log("Current Behavioral Profile:", currentProfile);
      console.log("Trust Score:", trustEngineResult.trustScore);
      console.log("Risk Level:", trustEngineResult.riskLevel);
      console.log("Trust Explanation:", trustEngineResult.explanation);
    }

    localStorage.setItem(
      trimmedUsername,
      JSON.stringify({
        ...currentProfile,
        trustMetrics: trustEngineResult,
      })
    );

    console.log("TwinTrust behavioralData:", behavioralData);

    if (onLoginSuccess) {
      onLoginSuccess({
        trustScore: trustEngineResult.trustScore,
        riskLevel: trustEngineResult.riskLevel,
        behavioralData: {
          ...currentProfile,
          trustMetrics: trustEngineResult,
          deviationAnalysis: previousProfile
            ? createDeviationAnalysis(previousProfile, currentProfile)
            : null,
        },
      });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-slate-900/70 backdrop-blur-md border border-slate-700 rounded-3xl p-8 shadow-2xl">

        <div className="flex flex-col items-center mb-8">

          <div className="bg-blue-600 p-4 rounded-full mb-4 text-white shadow-lg shadow-blue-900/30">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-8 w-8"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3l7 3v5c0 4.97-3.33 9.12-7 10-3.67-.88-7-5.03-7-10V6l7-3z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.75h.01" />
            </svg>
          </div>

          <h1 className="text-white text-3xl font-bold">
            TwinTrust
          </h1>

          <p className="text-slate-400 mt-2 text-center">
            AI-Driven Behavioral Authentication
          </p>

        </div>


        <form className="space-y-5" onSubmit={handleLogin}>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            onPaste={handlePasswordClipboard}
            onCopy={handlePasswordClipboard}
            onCut={handlePasswordClipboard}
            className="
            w-full
            p-3
            rounded-xl
            bg-slate-800
            text-white
            border
            border-slate-700
            focus:outline-none
            focus:border-blue-500
            "
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onFocus={handlePasswordFocus}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onPaste={handlePasswordClipboard}
            onCopy={handlePasswordClipboard}
            onCut={handlePasswordClipboard}
            className="
            w-full
            p-3
            rounded-xl
            bg-slate-800
            text-white
            border
            border-slate-700
            focus:outline-none
            focus:border-blue-500
            "
          />

          <button
            type="submit"
            className="
            w-full
            bg-blue-600
            hover:bg-blue-700
            transition
            p-3
            rounded-xl
            text-white
            font-semibold
            "
          >
            Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;