package net.softsociety.secretary.service;

import java.util.List;

import net.softsociety.secretary.domain.FridgeFood;

public interface FridgeFoodService {
    void addFridgeFood(FridgeFood fridgeFood,int familyId);
    FridgeFood getFoodDetails(int foodId);
    List<FridgeFood> getAllFridgeFoods();
}