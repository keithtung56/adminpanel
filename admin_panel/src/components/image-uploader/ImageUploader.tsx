import { Box, Button } from "@mui/material";
import {
  Dispatch,
  SetStateAction,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const StyledInput = styled.input`
  display: none;
`;

const StyledImg = styled.img<{ $isHover?: boolean }>`
  max-width: 100%;
  max-height: 100%;
  opacity: ${({ $isHover }) => ($isHover ? 0.5 : 1)};
`;

const StyledBox = styled(Box)`
  position: relative; // Add this line
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  border: 1px solid black;
`;

const ButtonWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: 10px;
`;
const ReplaceButton = styled(Button)``;
type Props = {
  className?: string;
  setImageFile: Dispatch<SetStateAction<File | undefined>>;
  setImageChanged?: Dispatch<SetStateAction<boolean>>;
  defaultImgPath?: string;
};
export const ImageUploader = memo(
  ({
    className,
    setImageFile,
    setImageChanged,
    defaultImgPath = "",
  }: Props) => {
    const { t } = useTranslation();
    const uploadInput = useRef<HTMLInputElement>(null);
    const [imgURL, setImgURL] = useState<string>(defaultImgPath);
    const [isHover, setIsHover] = useState<boolean>(false);

    useEffect(() => {
      setImgURL(defaultImgPath);
    }, [defaultImgPath]);

    const ImageOnChange = useCallback(() => {
      if (uploadInput.current?.files && uploadInput.current?.files[0]) {
        setImageFile(uploadInput.current.files[0]);
        setImgURL(URL.createObjectURL(uploadInput.current.files[0]));
        if (setImageChanged) {
          setImageChanged(true);
        }
        setIsHover(false);
      }
    }, [setImageFile, setImgURL, setImageChanged]);

    const ReplaceButtonOnClick = useCallback(() => {
      if (uploadInput.current) {
        uploadInput.current.click();
      }
    }, [uploadInput]);

    const UploadButtonOnClick = useCallback(() => {
      if (uploadInput.current) {
        uploadInput.current.click();
      }
    }, []);
    return (
      <StyledBox
        className={className}
        onMouseEnter={() => {
          setIsHover(true);
        }}
        onMouseLeave={() => {
          setIsHover(false);
        }}
      >
        <StyledInput
          ref={uploadInput}
          type="file"
          onChange={() => {
            ImageOnChange();
          }}
          accept="image/*"
        ></StyledInput>
        {imgURL && <StyledImg src={imgURL} $isHover={isHover} />}
        {isHover && imgURL && (
          <ButtonWrapper>
            <ReplaceButton
              variant="contained"
              onClick={() => {
                ReplaceButtonOnClick();
              }}
            >
              {t("button.replace")}
            </ReplaceButton>
          </ButtonWrapper>
        )}
        {!imgURL && (
          <Button
            onClick={() => {
              UploadButtonOnClick();
            }}
            variant="contained"
          >
            {t("button.upload")}
          </Button>
        )}
      </StyledBox>
    );
  }
);

ImageUploader.displayName = "ImageUploader";
