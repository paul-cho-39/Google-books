import { ImageLinks, ImageLinksPairs, VolumeInfo } from '../../types/googleBookTypes';

// images
// if the return type is not specified, it will return any. This function should return string;
export function getAvailableThumbnail<T extends ImageLinks | ImageLinksPairs>(
   imageLinks: T | undefined
) {
   if (!imageLinks) {
      return isThumbnailAvailable(imageLinks);
   }

   if (imageLinks && 'medium' in imageLinks) {
      const priority = imageLinks.medium;
      return priority ? priority : isThumbnailAvailable(imageLinks);
   }

   return isThumbnailAvailable(imageLinks);
}

// helper function for images
export function getHighestQualityImage(image: Partial<ImageLinksPairs>) {
   isThumbnailAvailable(image);
   const thumbnail = image?.thumbnail;
   const regex = /(zoom=)[0-9]/gi;
   const priorityImage = thumbnail?.replace(regex, 'zoom=3');
   return priorityImage;
   // return thumbnail;
}

// private
function isThumbnailAvailable<T extends ImageLinks | ImageLinksPairs>(image: T | undefined) {
   if (!image || !image.thumbnail) return '/unavailableThumbnail.png';

   return image.thumbnail;
}

// description
export function removeHtmlTags(description: string | undefined) {
   if (!description) return;

   // const breakDescription = description.split('<br><br>');
   // const regex = /(<[^>]*>)/gi;
   // return breakDescription.map((description) => description.replaceAll(regex, '').trim());
   // breaks line for each of the breaks

   const normalizedDescription = description.replace(/<br\s*\/?>/gi, '\n');

   const breakDescription = normalizedDescription.split('\n');

   const regex = /(<[^>]*>)/gi;
   return breakDescription.map((description) => description.replaceAll(regex, '').trim());
}

export function sliceDescription(description: string[] | undefined, sliced: number = 150) {
   if (!description) return;

   return description.toString().substring(0, sliced);
}

// publisher dates
export function filterDates(date: string | undefined) {
   if (date) {
      const toDate = new Date(date);
      // get month in string format
      return `${toDate.toLocaleDateString('default', {
         month: 'long',
      })} ${toDate.getDate()}, ${toDate.getFullYear()}`;
   }
}

// breaking categories
export function breakCategories(categories: string[] | undefined) {
   if (categories && categories.length > 0) {
      const filterCategories = categories
         .map((category) => category.replaceAll(' / ', ','))
         .flatMap((d) => d.split(',').map((val) => val.trim()));
      return removeDuplicates(filterCategories);
   }
}

// helper function
function removeDuplicates(arr: string[]) {
   return arr.filter((item, index) => arr.indexOf(item) === index);
}
