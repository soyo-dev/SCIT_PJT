package net.softsociety.secretary.service;

import net.softsociety.secretary.domain.Transaction;

public interface CashbookService {

	/** 내역 입력 */
	int insertTrans(Transaction trans);

	/** 내역 삭제 */
	int deleteTrans(Transaction trans);

}