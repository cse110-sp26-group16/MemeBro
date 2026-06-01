/**
 * Calls ImgFlip's get_memes function and returns an array.
 * @param {Array<string>|string} [type] The kind of meme to receive in the output
 *   array. Accepts `"image"`, `"gif"`, `"both"`, or an array like `["gif", "image"]`.
 *   Defaults to `"image"`.
 * @returns {Promise<Array<object>>} A Promise that resolves to the top 100 memes
 *   ordered by how many times they were captioned in the last 30 days.
 */
async function getMemes(type) {
  const apiURL = "https://api.imgflip.com/get_memes";
  const url = new URL(apiURL);

  let typeParameter = "image";

  if (type) {
    if (Array.isArray(type)) {
      typeParameter = type.join(",");
    } else {
      typeParameter = type;
    }
  }

  url.searchParams.append("type", typeParameter);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("HTTP Error! Status: " + response.status);
  }

  const jsonMemes = await response.json();

  if (jsonMemes.success && jsonMemes.data && Array.isArray(jsonMemes.data.memes)) {
    return jsonMemes.data.memes.map(
      /**
       * @param {object} meme The meme object from the ImgFlip API. Contains top 100 most used templates.
       * @returns {{id:string, name: string, imageUrl: string, width: number, height: number}}
       * This is the formatted meme template.
       */
      (meme) => ({
        id: meme.id,
        name: meme.name,
        imageUrl: meme.url,
        width: meme.width,
        height: meme.height,
      })
    );
  }

  throw new Error("The ImgFlip API has returned an unsuccessful response.");
}

/**
 * Calls ImgFlip's get_memes function and returns an array of ImgFlip's most
 * popular meme templates at the current moment.
 *
 * @returns {Promise<Array<object>>} A Promise that resolves to the top 100 memes
 *   ordered by how many times they were captioned in the last 30 days.
 */
export async function getPopularTemplates() {
  const popTemplates = await getMemes("image");
  return popTemplates;
}

/**
 * Calls ImgFlip's get_memes function and returns an array.
 * @param {string} [query] The name of a meme to search for in the name of the
 *                         meme templates
 * @returns {Promise<Array<object>>} A Promise that resolves to an array of
 *                                   matching meme templates
 */
export async function searchTemplates(query) {
  const topTemplates = await getMemes("image");

  const filteredMemes = topTemplates.filter(
    /**
     * Checks if a meme template's name includes the search query (case-insensitive).
     * @param {object} template - A formatted meme template.
     * @param {string} template.name - The name of the meme template to evaluate.
     * @returns {boolean} returns true if the template name matches the query, false otherwise.
     */
    function (template) {
      const memeNameLC = template.name.toLowerCase();
      const queryLC = query.toLowerCase();
      return memeNameLC.includes(queryLC);
    }
  );

  return filteredMemes;
}
