# **Game Development Plan**

## **High-Level Themes**

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

## **Initial Gameplay Mechanics Detail**

### **Core Gameplay Loop (Prototype)**
1. **Resource Gathering Mode:**

   * Passive phase for collecting raw resources (stone, wood, food).
   * Resources used directly or indirectly in combat (crafting weapons/tools, replenishing HP, etc.).

2. **Management Mode:**

   * React-based UI for managing permanent upgrades that scale exponentially, with clear magnitude thresholds.
   * Introduce crafting mechanics (e.g., converting stones into smaller rocks for throwing or crafting spears).   
   * Players initiate combat/expansion phases by selecting regions on a map.  
   * Systems
     * Crafting: making items for use in gathering or combat
     * Workshop: spend coins(or other resrouces) for immediate upgrades to skills/buffs
     * Labs: spend coins(or other resrouces) to research (takes timee) upgrades to the effectiveness of levels of skills/buffs. Can also unlock new mechancis      

3. **Combat/Expansion Mode:**

   * Gameplay inspired by mechanics in games like "The Tower" (a tower defense type game)  with enemies approaching from multiple directions and the player or automated soldiers firing projectiles or fighting melee.  
   * Gameplay involves defending against waves of progressively difficult geometric-shaped enemies.
   * Combat utilizes resources gathered in farming. (e.g., stones as throwable projectiles or crafted items)
   * Rewards include cash (used in-run for temporary upgrades), coins (used for permanent upgrades), and possibly additional resources like leather for crafting.

### **Enemy Progression**

* Each enemy's difficulty level represented visually by geometric complexity:  
  * **Dot:** Easiest enemy, minimal threat.  
  * **Line:** Slightly harder, increased threat.  
  * **Triangle:** More challenging, higher damage, and health.  
  * **Square (and Rectangle):** Further increased difficulty, stronger stats.  
  * **Pentagon and Beyond:** Progressively tougher enemies with more sides.  
  * **Bosses:** Larger circles (hollow), distinctly tougher encounters providing significant rewards.  
* Enemy waves structured so that every ten waves introduce tougher enemy shapes with higher probabilities of spawning.

### **Visual Style Inspiration**

* The combat UI emphasizes simplicity and clarity:  
  * Central entity (player/tower) clearly represented, surrounded by waves of incoming geometric enemies.  
  * Projectiles and enemy health/damage indicators clearly visible, simple animations, bright contrasting colors.  
  * Minimalist UI elements provide clear immediate visual feedback and maintain focus on gameplay.

## **Gameplay Mechanics Details**

## Stages
* Wilderness
* Town
* Region
* Country
* Continent
* Planet
* Solar System
* Quadrant
* Galaxy
* Universe

## Stage Interaction & Progression Loop
* Implement stage-crossing upgrades or research (in a laboratory system) that:
  * Enhance lower-stage efficiency when higher stages are reached (e.g., town-level upgrades significantly boost wilderness resource yield).
  * Encourage revisiting earlier stages due to meaningful, noticeable progression leaps unlocked at higher stages.

## Resource Utilization & Relevance

* Introduce resource transformations: Early-stage resources (stones/wood) can convert or upgrade into advanced resources or equipment relevant in later stages (e.g., wood → charcoal → fuel cells).
* Stage-specific resources with universal currencies (coins, gems) that persist and remain valuable throughout all stages.

## Modes within a stage
### Gathering
* TODO
### Management
#### Workshop
* Spend Coins (maybe other resrouces) to upgrade starting levels of combat stats (damage/defense)
#### Labs
* Costs resrouces (coins, maybe more) and take time to research
* Universal vs. Stage-Specific Upgrades
  * "General Efficiency" lab upgrades that universally enhance resource gathering, combat efficacy, or reduce resource costs, with stage-specific modifiers that tune how impactful these universal bonuses are across stages.
* Cross-Stage Interconnectivity
  * Cross-Stage Research: Players invest in research at higher stages (planet/solar/galaxy) that reduces the effectiveness penalty of previous stages, reinforcing earlier-stage replayability and exponential growth loops.  
#### Crafting
* Craftable Combat Gear: Stones and wood craft weapons/tools enhancing combat effectiveness.
  * Examples
    * Stones are broken down into multiple projectiles (small rocks) that can be thrown by hand, extending resource longevity and utility.
    * Craft a slingshot
    * Break down rocks into smeller pebbels that can be used in a slingshot
    * Slingshot does more damg (faster projectile) while increasing quantity of projectiles which can be brought to battle
      * Bring 1 stone to throw once for 100 damage
      * Bring 10 rocks (from 1 stone) which can be thrown for 10 damage each (100 total dmg)
      * Bring 100 pebbles (from 10 rocks broken up) which cna be shot for 2 damage each (200 total dmg)

### Combat
* Toggleable Active Resource Use: Introduce a toggle option during combat for using expendable resources (stones), making tactical choices meaningful (e.g., toggling throwing stones only when combat difficulty ramps up).
* Role Specialization: Players configure combat unit roles (e.g., ranged attackers, melee defenders, support healers using food).
* Combat rewards include:
  * Resources
    * Cash: Temporary upgrades within the current run.
    * Coins: Persistent upgrades in the management phase.
    * Special Resources: (like leather from wolves) for crafting or specific stage-linked upgrades.
  * Clearing waves buffs yields/rarity of resrouce nodes in the Gathering Mode
* In Run upgrades
  * Spend Cash to improve levels of things like damage and defense stats
  * Starting level of stats based on Workshop upgrades


## Misc

* **Laboratory and Workshop Systems:**
  * Laboratory offers passive, long-term incremental improvements.  
  * Workshop provides immediate upgrade benefits upon resource investment.  

* **Resource and Territory Management:**
  * Territory management following successful combat phases, unlocking strategic resources.  
  * Incremental complexity in resource types, rarity, and management.  

* **Guild and Multiplayer Mechanics:**
  * Joint efforts for territory conquest, special events, and resource collection.  
  * Enhanced cooperative gameplay through incremental guild research.  

* **Economics and Trading:**
  * Optional trading system among players or guilds, leveraging resource rarity and strategy.

### **Initial Technical Approach**

* **Tech Stack:** React/Next.js for rapid UI iteration.  
* **Graphics:** WebGL via PhaserJs for interactive gameplay visuals.  
* **Initial Focus:**  
  * Core MVP: basic resource collection, initial combat mechanics, and essential upgrades managed via React.
