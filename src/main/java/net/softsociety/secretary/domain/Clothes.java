package net.softsociety.secretary.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Clothes {
	int clothesNum;
	int familyId;
	int closetNum;
	String clothesMaterial;
	String clothesCategory;
	String clothesSeasons;
	String clothesSize;
	String clothesImg;
	boolean clothesLaundry;
	int clothesPutoncnt;
}
