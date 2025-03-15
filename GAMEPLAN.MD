## **Game Development Plan**

### **1\. High-Level Themes**

* **Visual Scale and Automation:**

  * Visually experience scale and growth, not just numeric increases.  
  * Begin with manual actions evolving gradually into fully automated systems, providing visually rewarding progression (inspired by Dyson Sphere Program and Factorio).  
* **Cooperative Gameplay (Future Phase):**

  * Collaborative progression with guilds/alliances to achieve mutual goals.  
  * Mechanisms allowing players to help each other speed up progression and enhance collective power.  
* **Progressive Complexity:**

  * Gradually introduce new gameplay mechanics and UI elements.  
  * Expose increasing complexity over time to maintain player engagement without initial overwhelm.  
* **Incremental Progression (Active & Passive):**

  * Clear incremental growth, both visually and numerically.  
  * Meaningful offline progression complements active gameplay, encouraging regular player engagement.

---

## **Detailed Vision and Mechanics**

### **Visual Scale and Automation**

* Players begin as a single entity gathering resources manually, evolving into managing larger entities (town → region → planet → solar system → galaxy → multiverse).  
* Automation gradually reduces manual actions, enhancing visual and numerical satisfaction in progression.  
* Scale visually represented through clear incremental tiers, expanding scope progressively.

### **Progressive Complexity**

* Initial gameplay features minimal UI complexity, starting with basic actions like collecting resources.  
* Introduce complexity incrementally, such as new resource types, combat options, and upgrades (laboratories and workshops).

### **Incremental and Offline Progression**

* Active phases include resource gathering and expansion/combat with visual feedback.  
* Offline phases allow passive resource collection and upgrades, creating an incentive for regular interaction.

### **Cooperative Gameplay (Future Phase)**

* Guild mechanics for cooperative resource management and progression:  
  * Players can submit requests for resources or assistance.  
  * Guild research increases the effectiveness of cooperative actions.  
  * Shared benefits from guild actions create a cyclical loop of mutual improvement.

### **Initial Gameplay Mechanics Detail**

#### **Core Gameplay Loop (Prototype)**

1. **Resource Gathering Mode:**

   * Simple canvas-based interaction, collecting basic resources (wood, stone, food).  
2. **Management Mode:**

   * React-based UI for managing permanent upgrades.  
   * Players initiate combat/expansion phases by selecting regions on a map.  
3. **Combat/Expansion Mode:**

   * Canvas-based gameplay inspired by mechanics in games like "The Tower" (a tower defense type game)  with enemies approaching from multiple directions and the player or automated soldiers firing projectiles or fighting melee.  
   * Players manage limited resources (ammo like stones for damage, berries for health regeneration).  
   * Gameplay involves defending against waves of progressively difficult geometric-shaped enemies.

### **Enemy Progression**

* Each enemy's difficulty level represented visually by geometric complexity:  
  * **Dot:** Easiest enemy, minimal threat.  
  * **Line:** Slightly harder, increased threat.  
  * **Triangle:** More challenging, higher damage, and health.  
  * **Square (and Rectangle):** Further increased difficulty, stronger stats.  
  * **Pentagon and Beyond:** Progressively tougher enemies with more sides.  
  * **Bosses:** Larger circles (hollow), distinctly tougher encounters providing significant rewards.  
* Enemy waves structured so that every ten waves introduce tougher enemy shapes with higher probabilities of spawning.

### **Visual Style Inspiration (from Screenshots)**

* The combat UI emphasizes simplicity and clarity:  
  * Central entity (player/tower) clearly represented, surrounded by waves of incoming geometric enemies.  
  * Projectiles and enemy health/damage indicators clearly visible, simple animations, bright contrasting colors.  
  * Minimalist UI elements provide clear immediate visual feedback and maintain focus on gameplay.

### **Detailed Gameplay Mechanics (Future Phases)**

* **Guild and Multiplayer Mechanics:**

  * Joint efforts for territory conquest, special events, and resource collection.  
  * Enhanced cooperative gameplay through incremental guild research.  
* **Laboratory and Workshop Systems:**

  * Laboratory offers passive, long-term incremental improvements.  
  * Workshop provides immediate upgrade benefits upon resource investment.  
* **Resource and Territory Management:**

  * Territory management following successful combat phases, unlocking strategic resources.  
  * Incremental complexity in resource types, rarity, and management.  
* **Economics and Trading:**

  * Optional trading system among players or guilds, leveraging resource rarity and strategy.

### **Initial Technical Approach**

* **Tech Stack:** React/Next.js for rapid UI iteration.  
* **Graphics:** HTML5 Canvas for interactive gameplay visuals.  
* **Development Tools:** Cursor AI to quickly prototype and iterate.  
* **Initial Focus:**  
  * Core MVP: basic resource collection, initial combat mechanics, and essential upgrades managed via React.
