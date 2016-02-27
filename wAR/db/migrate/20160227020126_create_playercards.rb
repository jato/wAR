class CreatePlayercards < ActiveRecord::Migration
  def change
    create_table :playercards do |t|

      t.timestamps null: false
    end
  end
end
