const btn = document.querySelector(".changeColorBtn");
const colorGrid = document.querySelector(".colorGrid");
const colorValue = document.querySelector(".colorValue");

btn.addEventListener("click", async () => {
  chrome.storage.sync.get("color", ({ color }) => {
    console.log("color:", color);
  });
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log(tab);

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: pickColor,
    },
    async (injectResult) => {
      const [data] = injectResult;
      if (data.result) {
        const color = data.result.sRGBHex;
        console.log(color);
        colorGrid.style.backgroundColor = color;
        colorValue.innerText = color;
        try {
          await navigator.clipboard.writeText(color);
        } catch (error) {
          console.log(error);
        }
      }
    }
  );
});

const pickColor = async () => {
  console.log("scripting working");
  try {
    const eyeDropper = new EyeDropper();
    return await eyeDropper.open();
  } catch (error) {
    console.log(error);
  }
};
