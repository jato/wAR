class CreateCards < ActiveRecord::Migration
  def change
    create_table :cards do |t|

      t.sring :suit
      t.string :value

      t.timestamps null: false
    end
  end
end
