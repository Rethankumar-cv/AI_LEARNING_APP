/**
 * Gen-Z Caption Generator for Achievement Sharing
 * Generates trendy, relatable captions for social media
 */

// Gen-Z slang and phrases
const genZPhrases = {
    excited: [
        "no cap",
        "fr fr",
        "this hits different",
        "I'm lowkey obsessed",
        "it's giving main character energy",
        "ate and left no crumbs",
        "slay",
        "bussin",
        "fire",
        "valid",
    ],
    humble: [
        "ngl",
        "just vibing",
        "living my best life",
        "it's the __ for me",
        "POV:",
        "we love to see it",
    ],
    proud: [
        "made it",
        "understood the assignment",
        "manifesting success",
        "main character moment",
        "hot girl/boy energy",
        "doing the most",
    ],
    emojis: {
        fire: "🔥",
        sparkles: "✨",
        rocket: "🚀",
        brain: "🧠",
        trophy: "🏆",
        star: "⭐",
        check: "✅",
        crown: "👑",
        lightning: "⚡",
        celebrate: "🎉",
    },
};

/**
 * Generate Gen-Z style caption for an achievement
 */
export function generateGenZCaption(achievement) {
    // Return default if achievement is null
    if (!achievement) {
        return `Achievement unlocked ${genZPhrases.emojis.trophy} It's giving success vibes ${genZPhrases.emojis.fire}`;
    }

    const { title, category, progress, target } = achievement;

    const captions = {
        // Document achievements
        document: {
            first_document: [
                `Just uploaded my first study doc ${genZPhrases.emojis.fire} Main character energy fr fr`,
                `POV: You're watching me level up my study game ${genZPhrases.emojis.sparkles} No cap, this app hits different`,
                `Started my learning journey and I'm already obsessed ${genZPhrases.emojis.rocket} It's giving success vibes`,
            ],
            document_collector: [
                `10 docs uploaded and I'm not stopping ${genZPhrases.emojis.fire} Understood the assignment ${genZPhrases.emojis.check}`,
                `Collecting study materials like it's a full-time job ${genZPhrases.emojis.brain} We love to see it`,
                `That feeling when you hit 10 documents ${genZPhrases.emojis.celebrate} Ate and left no crumbs`,
            ],
            library_master: [
                `50 DOCUMENTS?! ${genZPhrases.emojis.crown} I'm literally the CEO of studying rn`,
                `Built different ${genZPhrases.emojis.fire} 50 docs and counting. This is what dedication looks like`,
                `POV: You're witnessing peak academic excellence ${genZPhrases.emojis.sparkles} Library Master unlocked`,
            ],
        },

        // Quiz achievements
        quiz: {
            first_quiz: [
                `Just took my first quiz and I'm lowkey proud ${genZPhrases.emojis.brain} This app is bussin`,
                `First quiz done ${genZPhrases.emojis.check} It's the study grind for me ${genZPhrases.emojis.fire}`,
                `Starting my quiz era ${genZPhrases.emojis.rocket} Living my best life fr`,
            ],
            quiz_enthusiast: [
                `10 quizzes completed ${genZPhrases.emojis.trophy} Ngl I'm kind of a genius now`,
                `Quiz streak going crazy ${genZPhrases.emojis.fire} This is what winning looks like`,
                `That moment when you realize you're addicted to learning ${genZPhrases.emojis.brain} 10 quizzes and vibing`,
            ],
            quiz_master: [
                `50 QUIZZES DONE ${genZPhrases.emojis.crown} I literally can't be stopped`,
                `Main character energy: unlocked ${genZPhrases.emojis.sparkles} 50 quizzes later and still going`,
                `They said it couldn't be done. I said "watch me" ${genZPhrases.emojis.trophy} Quiz Master achieved`,
            ],
        },

        // Flashcard achievements  
        flashcard: {
            first_flashcards: [
                `Made my first flashcards ${genZPhrases.emojis.lightning} Study game strong`,
                `POV: You just discovered the best study method ${genZPhrases.emojis.sparkles} Flashcard gang rise up`,
                `First flashcard set created ${genZPhrases.emojis.check} It's giving organized student vibes`,
            ],
            flashcard_fan: [
                `100 flashcards deep ${genZPhrases.emojis.fire} My memory is lowkey superhuman now`,
                `That satisfying feeling when you hit 100 flashcards ${genZPhrases.emojis.celebrate} We're so back`,
                `Built different ${genZPhrases.emojis.brain} 100 flashcards and my brain is expanding`,
            ],
            memory_champion: [
                `500 FLASHCARDS?! ${genZPhrases.emojis.crown} I'm literally unstoppable`,
                `POV: You just became a memory god ${genZPhrases.emojis.sparkles} 500 flashcards conquered`,
                `They asked how I remember everything. I don't gatekeep ${genZPhrases.emojis.trophy} 500 flashcards strong`,
            ],
        },

        // Streak achievements
        streak: {
            week_warrior: [
                `7 day streak ${genZPhrases.emojis.fire} Consistency is key and I understood the assignment`,
                `One week of pure dedication ${genZPhrases.emojis.rocket} It's the discipline for me`,
                `Week 1: Complete ${genZPhrases.emojis.check} Living that consistent life`,
            ],
            month_master: [
                `30 DAY STREAK ${genZPhrases.emojis.crown} I'm literally built different`,
                `A whole month of studying ${genZPhrases.emojis.fire} Main character energy is unmatched`,
                `POV: You're watching dedication in action ${genZPhrases.emojis.sparkles} 30 days strong`,
            ],
            dedication_legend: [
                `100 DAYS STRAIGHT ${genZPhrases.emojis.trophy} I can't be stopped fr fr`,
                `They said take a break. I said "make me" ${genZPhrases.emojis.fire} 100 day streak unlocked`,
                `Dedication Legend status: ACHIEVED ${genZPhrases.emojis.crown} This is what peak performance looks like`,
            ],
        },

        // Level achievements
        level: {
            level_5: [
                `Level 5 ${genZPhrases.emojis.star} Rising Star energy activated`,
                `Just hit Level 5 ${genZPhrases.emojis.rocket} We're so back`,
                `POV: You're leveling up faster than expected ${genZPhrases.emojis.sparkles} Level 5 unlocked`,
            ],
            level_10: [
                `LEVEL 10 ${genZPhrases.emojis.trophy} Expert Learner status confirmed`,
                `Two digits babyyyy ${genZPhrases.emojis.fire} Level 10 hits different`,
                `They doubted. I proved them wrong ${genZPhrases.emojis.crown} Level 10: Complete`,
            ],
            level_25: [
                `LEVEL 25 ARE YOU KIDDING ME ${genZPhrases.emojis.crown} Legend status unlocked`,
                `POV: You just witnessed greatness ${genZPhrases.emojis.sparkles} Level 25 Learning Legend`,
                `This is what happens when you don't give up ${genZPhrases.emojis.trophy} Level 25 conquered`,
            ],
        },
    };

    // Get category-specific captions
    const categoryCaptions = captions[category]?.[achievement.achievementId] || [];

    // If no specific caption, generate a generic one
    if (categoryCaptions.length === 0) {
        return `Just unlocked "${title}" ${genZPhrases.emojis.trophy} It's giving achievement hunter vibes ${genZPhrases.emojis.fire}`;
    }

    // Return random caption from the list
    return categoryCaptions[Math.floor(Math.random() * categoryCaptions.length)];
}

/**
 * Generate multiple caption options
 */
export function generateCaptionOptions(achievement, count = 3) {
    const captions = new Set();

    // Generate unique captions
    while (captions.size < count) {
        captions.add(generateGenZCaption(achievement));
    }

    return Array.from(captions);
}

/**
 * Get shareable image text
 */
export function generateShareableText(achievement, userName) {
    const title = achievement.title;
    const icon = achievement.icon;

    return {
        title: `${icon} ${title}`,
        subtitle: `Unlocked by ${userName}`,
        appName: "StudyHub",
        hashtags: "#StudyHub #Achievement #LearningJourney #StudentLife #StudyMotivation",
    };
}
