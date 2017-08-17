import { Factory } from "meteor/dburles:factory";
import { expect } from "meteor/practicalmeteor:chai";
import { Shops, Groups } from "/lib/collections";
import { Reaction } from "/server/api";

describe("AddDefaultGroup", function () {
  beforeEach(function () {
    return Shops.remove({});
  });

  it("should add a new group to the defaults when called with name and permissions for the shop passed", () => {
    const shop = Factory.create("shop");
    const shop2 = Factory.create("shop");

    Reaction.addDefaultGroup({
      shopId: shop._id,
      name: "Test Group",
      permissions: ["test-permission"]
    });

    const group = Groups.findOne({ name: "Test Group", shopId: shop._id });
    const group2 = Groups.findOne({ name: "Test Group", shopId: shop2._id });
    expect(group.permissions).to.contain("test-permission");
    expect(group2).to.be.undefined;
  });

  it("should add a new group to the defaults when called with name and permissions for all shops", () => {
    const shop = Factory.create("shop");
    const shop2 = Factory.create("shop");

    Reaction.addDefaultGroup({
      name: "Test Group",
      permissions: ["test-permission"]
    });

    const group = Groups.findOne({ name: "Test Group", shopId: shop._id });
    const group2 = Groups.findOne({ name: "Test Group", shopId: shop2._id });
    expect(group.permissions).to.contain("test-permission");
    expect(group2.permissions).to.contain("test-permission");
  });
});
