import { ImageLinks, ImageLinksPairs } from "../../types/googleBookTypes";

// images
export function getAvailableThumbnail(imageLinks: Partial<ImageLinks>) {
  isThumbnailAvailable(imageLinks);
  const priority = imageLinks.medium;
  return priority
    ? priority
    : !imageLinks.small
    ? imageLinks.thumbnail
    : imageLinks.small;
}

// helper function for images
export function getHighestQualityImage(image: Partial<ImageLinksPairs>) {
  isThumbnailAvailable(image);
  const thumbnail = image?.thumbnail;
  const regex = /(zoom=)[0-9]/gi;
  const priorityImage = thumbnail?.replace(regex, "zoom=3");
  return priorityImage;
  // return thumbnail;
}

// private
function isThumbnailAvailable(image: ImageLinksPairs | Partial<ImageLinks>) {
  if (!image || !image.thumbnail) return "/unavailableThumbnail.png";
}

// description
export function removeHtmlTags(description: string) {
  const breakDescription = description.split("<br><br>");
  const regex = /(<[^>]*>)/gi;
  return breakDescription.map((description) =>
    description.replaceAll(regex, "").trim()
  );
}

export function sliceDescription(description: string[], sliced: number = 150) {
  return description.toString().substring(0, sliced);
}

// publisher dates
export function filterDates(date: string | undefined) {
  if (date) {
    const toDate = new Date(date);
    // get month in string format
    return `${toDate.toLocaleDateString("default", {
      month: "long",
    })} ${toDate.getDate()}, ${toDate.getFullYear()}`;
  }
}

// breaking categories
export function breakCategories(categories: string[] | undefined) {
  if (categories && categories.length > 0) {
    const filterCategories = categories
      .map((category) => category.replaceAll(" / ", ","))
      .flatMap((d) => d.split(",").map((val) => val.trim()));
    return removeDuplicates(filterCategories);
  }
}

// helper function
function removeDuplicates(arr: string[]) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}
