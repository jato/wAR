class CreateCards < ActiveRecord::Migration
  def change
    create_table :cards do |t|

      t.string :suit
      t.string :value

      t.timestamps null: false
    end
  end
end
