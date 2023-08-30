package net.softsociety.secretary.service;

import java.util.ArrayList;

import net.softsociety.secretary.domain.Closet;
import net.softsociety.secretary.domain.Clothes;

public interface ClosetService {

	int insertCloset(Closet closet);
	
	//옷장정보 불러오기
	ArrayList<Closet> findAllCloset();
	
	//옷장에 의류등록
	void insertClothes(Clothes clothes);

	// 옷장에 의류목록 출력
	ArrayList<Clothes> findClothes(int closetNum);

}
