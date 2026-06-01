import { describe, it, expect, beforeEach, afterEach, vi} from "vitest";
import { getPopularTemplates, searchTemplates,} from "../../js/api/imgflip-api";


beforeEach(() => {

    global.fetch = vi.fn();
});

afterEach(() => {
    vi.restoreAllMocks();
});

const mockData = [
    {
        id: "322841258",
        name: "Anakin Padme 4 Panel",
        url: "https://i.imgflip.com/5c7lwq.png",
        width: 768,
        height: 768
    },
    {
        id: "217743513",
        name: "UNO Draw 25 Cards",
        url: "https://i.imgflip.com/3lmzyx.jpg",
        width: 500,
        height: 494
    },
    
];

const mockSuccess = {
    success: true,
    data: {memes: mockData}
};


describe("getPopularTemplates()", () => {
    it("resolves to an array whose items match the Template typedef", async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => mockSuccess,
        });

        const templates = await getPopularTemplates();

        expect(Array.isArray(templates)).toBe(true);
        expect(templates).toHaveLength(2);

        templates.forEach(template => {
            expect(template).toHaveProperty("id");
            expect(typeof template.id).toBe("string");

            expect(template).toHaveProperty("name");
            expect(typeof template.name).toBe("string");

            expect(template).toHaveProperty("imageUrl");
            expect(typeof template.imageUrl).toBe("string");

            expect(template).toHaveProperty("width");
            expect(typeof template.width).toBe("number");

            expect(template).toHaveProperty("height");
            expect(typeof template.height).toBe("number");

        });
    });
});

describe("searchTemplates()", () => {
    it(" should return only matching templates based on keyword 'drake'", async () => {

        const drakeMemeData = {
            success: true,
            data: {
                memes: [
                    {id: "181913649", name: "Drake Hotline Bling", url: "https://i.imgflip.com/30b1gx.jpg", width: 1200, height: 1200},
                    {id: "91998305", name: "Drake Blank", url: "https://i.imgflip.com/1iruch.jpg", width: 717, height: 717},
                    {id: "131087935", name: "Running Away Balloon", url: "https://i.imgflip.com/261o3j.jpg", width: 761, height: 1024}
                ]
            }
        };

        vi.mocked(global.fetch).mockResolvedValueOnce({
            ok:true,
            json: async () => drakeMemeData,
        });

        const filteredTemplates = await searchTemplates("drake");

        expect(filteredTemplates).toHaveLength(2);
        expect(filteredTemplates[0].name).toBe("Drake Hotline Bling");
        expect(filteredTemplates[1].name).toBe("Drake Blank");
    });
});

describe("ImgFlip API functions error assertion", () => {
    it("should throw Error on non-2xx response", async () => {

        vi.mocked(global.fetch).mockResolvedValue({
            ok: false,
            status: 404,
        });

        await expect(getPopularTemplates()).rejects.toThrow("HTTP Error! Status: 404");
        await expect(searchTemplates("drake")).rejects.toThrow("HTTP Error! Status: 404");
    });

    it("should throw Error on malformed JSON", async () => {
        vi.mocked(global.fetch).mockResolvedValue({
            ok: true,
            json: async () => ({success: false}),        
        });

        const errorUnsuccessful = "The ImgFlip API has returned an unsuccessful response."
        await expect(getPopularTemplates()).rejects.toThrow(errorUnsuccessful);
        await expect(searchTemplates('drake')).rejects.toThrow(errorUnsuccessful);
    })

});

