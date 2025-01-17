package net.softsociety.secretary.util;

import java.io.File;
import java.io.IOException;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import com.google.common.io.Files;


/**
 * 파일 관련 유틸
 * 업로드한 파일의 저장 & 서버에 저장된 파일 삭제 등의 기능
 */
public class FileService {

	/**
	 * 업로드 된 파일을 지정된 경로에 저장하고, 저장된 파일명을 리턴
	 * @param mfile 업로드된 파일
	 * @param path 저장할 경로
	 * @return 저장된 파일명
	 */
	public static String saveFile(MultipartFile mfile, String uploadPath) {
		
		//업로드된 파일이 없거나 크기가 0이면 저장하지 않고 null을 리턴
		if (mfile == null || mfile.isEmpty() || mfile.getSize() == 0) {
			return null;
		}
		//저장 폴더가 없으면 생성
		File path = new File(uploadPath);
		if (!path.isDirectory()) {
			path.mkdirs();
		}
		//원본 파일명
		String originalFilename = mfile.getOriginalFilename();
		
		//원본 파일의 확장자
		int lastIndex = originalFilename.lastIndexOf('.');
		String ext = lastIndex == -1 ? "" : originalFilename.substring(lastIndex);

		//저장할 파일명을 오늘 날짜의 년월일로 생성
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		String savedFilename = sdf.format(new Date());
		
		//저장할 전체 경로와 파일명을 포함한 File 객체
		File serverFile = null;
		
		//같은 이름의 파일이 있는 경우의 처리
		while (true) {
			serverFile = new File(uploadPath + "/" + savedFilename + ext);
			//같은 이름의 파일이 없으면 반복 종료.
			if ( !serverFile.isFile()) break;	
			//같은 이름의 파일이 있으면 이름 뒤에 long 타입의 시간정보를 덧붙임.
			savedFilename += new Date().getTime();
		}
		
		//파일 저장
		try {
			mfile.transferTo(serverFile);
		} catch (Exception e) {
			savedFilename = null;
			e.printStackTrace();
		}
		
		//저장된 파일명 리턴
		return savedFilename + ext;
	}
	
	public static String processImg(String originalFilename, String uploadPath) {
		
		String originalFilePath = uploadPath + "/" + originalFilename;    //  c:/secretary/파일이름.확장자
		String pySavedPath = originalFilePath.substring(0,originalFilePath.length()-4) + "edited.PNG";
		String result = originalFilename.substring(0, originalFilename.length()-4) + "edited.PNG";
		//누끼따기
        try {
            // Python executable command and script path
        	String pythonCommand = "C:\\Python311\\python.exe";; // or "python3" depending on your setup
            String pythonScriptPath = "C:/Visual_Studio_Code/pythonWorkspace/changeImg.py";

            // Additional arguments to pass to the Python script
            
            // Create the ProcessBuilder
            ProcessBuilder processBuilder = new ProcessBuilder(pythonCommand, pythonScriptPath, originalFilePath, pySavedPath);

            // Redirect the error stream to the output stream
            processBuilder.redirectErrorStream(true);

            // Start the process
            Process process = processBuilder.start();

            // Wait for the process to finish
            int exitCode = process.waitFor();
            System.out.println("Python script exited with code: " + exitCode);

        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
		return result;	
	}
	
	/**
	 * 서버에 저장된 파일의 전체 경로를 전달받아, 해당 파일을 삭제
	 * @param fullpath 삭제할 파일의 경로
	 * @return 삭제 여부
	 */
	public static boolean deleteFile(String fullPath) {
		//전달된 전체 경로로 File객체 생성
		File delFile = new File(fullPath);
		
		//해당 파일이 존재하면 삭제하고 true 리턴
		if (delFile.isFile()) {
			delFile.delete();
			return true;
		}
		return false;
	}
	
	public static String mergedImgName(String uploadPath) {
		//저장할 파일명을 오늘 날짜의 년월일로 생성
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		String savedFilename = sdf.format(new Date());
		
		//저장할 전체 경로와 파일명을 포함한 File 객체
		File serverFile = null;
		
		//같은 이름의 파일이 있는 경우의 처리
		while (true) {
			serverFile = new File(uploadPath + "/" + savedFilename + ".png");
			//같은 이름의 파일이 없으면 반복 종료.
			if ( !serverFile.isFile()) break;	
			//같은 이름의 파일이 있으면 이름 뒤에 long 타입의 시간정보를 덧붙임.
			savedFilename += new Date().getTime();
		}
		return savedFilename + ".png";
	}
	
	public static String CopyImg(String originImgName, String uploadPath) {
		File orgFile = new File(uploadPath + "/" +originImgName);
		
		//원본 파일의 확장자
		int lastIndex = originImgName.lastIndexOf('.');
		String ext = lastIndex == -1 ? "" : originImgName.substring(lastIndex);
	
		//저장할 파일명을 오늘 날짜의 년월일로 생성
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		String savedFilename = sdf.format(new Date());
		
		//저장할 전체 경로와 파일명을 포함한 File 객체
		File outFile = null;
		
		//같은 이름의 파일이 있는 경우의 처리
		while (true) {
			outFile = new File(uploadPath + "/" + savedFilename + ext);
			//같은 이름의 파일이 없으면 반복 종료.
			if ( !outFile.isFile()) break;	
			//같은 이름의 파일이 있으면 이름 뒤에 long 타입의 시간정보를 덧붙임.
			savedFilename += new Date().getTime();
		}
		try {
			FileCopyUtils.copy(orgFile, outFile);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return savedFilename + ext;
	}//CopyImg끝
}
