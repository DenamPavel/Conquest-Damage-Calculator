/**
 * Dice rolling with optional seeding for reproducibility
 */
export class DiceRoller {
  private seed?: number;
  private state: number;

  constructor(seed?: number) {
    this.seed = seed;
    this.state = seed ?? Math.floor(Math.random() * 2147483647);
  }

  /**
   * Roll a single d6 (1-6)
   */
  public roll(): number {
    if (this.seed !== undefined) {
      // Seeded pseudo-random (Linear Congruential Generator algorithm)
      this.state = (this.state * 1103515245 + 12345) % 2147483648;
      return Math.floor((this.state / 2147483648) * 6) + 1;
    }
    return Math.floor(Math.random() * 6) + 1;
  }

  /**
   * Roll multiple d6 dice
   */
  public rollMultiple(count: number): number[] {
    return Array.from({ length: count }, () => this.roll());
  }
}
