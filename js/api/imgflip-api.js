/**
 * Calls ImgFlip's get_memes function and returns an array.
 * @param {Array<string>|string} [type] The kind of meme to receive in the output
 *   array. Accepts `"image"`, `"gif"`, `"both"`, or an array like `["gif", "image"]`.
 *   Defaults to `"image"`.
 * @returns {Promise<Array<object>>} A Promise that resolves to the top 100 memes
 *   ordered by how many times they were captioned in the last 30 days.
 */
export async function getMemes(type = "image") {
  const apiURL = "https://api.imgflip.com/get_memes";
  const url = new URL(apiURL);

  let typeParameter;

  if (Array.isArray(type)) {
    typeParameter = type.join(",");
  } else {
    typeParameter = type;
  }

  url.searchParams.append("type", typeParameter);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const jsonMemes = await response.json();

  if (jsonMemes.success && jsonMemes.data && Array.isArray(jsonMemes.data.memes)) {
    return jsonMemes.data.memes;
  }

  throw new Error("The ImgFlip API has returned an unsuccessful response.");
}
