package be.jorisg.humorhazard.data.party;

/**
 * Created by Joris on 14/04/2020 in project HumorHazardServer.
 */
public class PartySettings {

    private boolean visible = false;

    private int scoreLimit = 5;
    private int playerLimit = 10;
    private int timerDurationMultiplier = 1;

    public boolean isVisible() {
        return visible;
    }

    public void setVisible(boolean visible) {
        this.visible = visible;
    }

    public int scoreLimit() {
        return scoreLimit;
    }

    public void setScoreLimit(int scoreLimit) {
        this.scoreLimit = scoreLimit;
    }

    public int playerLimit() {
        return playerLimit;
    }

    public void setPlayerLimit(int playerLimit) {
        this.playerLimit = playerLimit;
    }

    public int timerDurationMultiplier() {
        return timerDurationMultiplier;
    }

    public void setTimerDurationMultiplier(int timerDurationMultiplier) {
        this.timerDurationMultiplier = timerDurationMultiplier;
    }
}
