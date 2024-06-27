import { memo } from "react";
import styled from "styled-components";

const StyledVideo = styled.video`
  max-width: 100%;
  max-height: 50vh;
`;
type Props = {
  src: string;
};
export const VideoDisplayer = memo(({ src }: Props) => {
  return (
    <StyledVideo controls>
      <source src={src} />
    </StyledVideo>
  );
});
VideoDisplayer.displayName = "VideoDisplayer";
