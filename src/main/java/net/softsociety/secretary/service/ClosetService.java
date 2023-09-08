package net.softsociety.secretary.service;

import java.util.ArrayList;

import net.softsociety.secretary.domain.Closet;
import net.softsociety.secretary.domain.Clothes;
import net.softsociety.secretary.domain.ClothesManager;

public interface ClosetService {

	int insertCloset(Closet closet);
	
	//옷장정보 불러오기
	ArrayList<Closet> findAllCloset();
	
	//옷장에 의류등록
	void insertClothes(Clothes clothes);

	// 옷장에 의류목록 출력 & 검색
	ArrayList<Clothes> findAllClothes(int closetNum, String category, String size, String material, String[] seasonArr, boolean clothesLaundry);
	
	// 옷장안 옷찾기
	Clothes findClothes(int closetNum, int clothesNum);
	// 옷장안 옷 삭제
	int deleteClothes(int closetNum, int clothesNum);
	
	//옷장안 의류정보 수정
	int updateClothes(Clothes clothes);

	//소재별 세탁및관리방법 찾아오기
	ClothesManager howToManageClothes(String clothesMaterial);
	
	//세탁물 체크
	void laundryIn(Clothes clothes);
	//세탁물 다시 옷장으로
	void laundryOut(int closetNum, int clothesNum);
	
}
