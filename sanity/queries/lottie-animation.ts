// sanity/queries/lottie-animation.ts
import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const lottieAnimationQuery = groq`
  _type == "lottie-animation" => {
    _type,
    _key,
    padding,
    colorVariant,
    sectionWidth,
    animationAlign,
    verticalSpacing,
    animationSize,
    ariaLabel,
    animation{
      asset->{
        _id,
        url,
        mimeType,
        size,
        originalFilename
      }
    },
    animationDark{
      asset->{
        _id,
        url,
        mimeType,
        size,
        originalFilename
      }
    }
  }
`;
